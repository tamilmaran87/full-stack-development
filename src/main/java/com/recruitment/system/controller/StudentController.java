package com.recruitment.system.controller;

import com.recruitment.system.model.Application;
import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.ApplicationStatus;
import com.recruitment.system.service.ApplicationService;
import com.recruitment.system.service.JobService;
import com.recruitment.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserService userService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        User student = getCurrentUser(authentication);

        model.addAttribute("user", student);
        model.addAttribute("totalApplications", applicationService.countByStudent(student.getId()));
        model.addAttribute("shortlisted",
                applicationService.countByStudentAndStatus(student.getId(), ApplicationStatus.SHORTLISTED));
        model.addAttribute("interviews",
                applicationService.countByStudentAndStatus(student.getId(), ApplicationStatus.INTERVIEW));
        model.addAttribute("hired",
                applicationService.countByStudentAndStatus(student.getId(), ApplicationStatus.HIRED));

        List<Application> recentApps = applicationService.findByStudent(student.getId());
        if (recentApps.size() > 5) {
            recentApps = recentApps.subList(0, 5);
        }
        model.addAttribute("recentApplications", recentApps);
        model.addAttribute("latestJobs", jobService.findActiveJobs().stream().limit(5).toList());

        return "student/dashboard";
    }

    @GetMapping("/profile")
    public String profile(Authentication authentication, Model model) {
        User student = getCurrentUser(authentication);
        model.addAttribute("user", student);
        return "student/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(Authentication authentication,
                                @RequestParam String fullName,
                                @RequestParam(required = false) String phone,
                                @RequestParam(required = false) String skills,
                                @RequestParam(required = false) Integer experience,
                                @RequestParam(required = false) MultipartFile resumeFile,
                                RedirectAttributes redirectAttributes) {
        User student = getCurrentUser(authentication);
        userService.updateProfile(student.getId(), fullName, phone, skills, experience, resumeFile);
        redirectAttributes.addFlashAttribute("successMessage", "Profile updated successfully!");
        return "redirect:/student/profile";
    }

    @PostMapping("/apply/{jobId}")
    public String applyToJob(@PathVariable Long jobId,
                             @RequestParam(required = false) String coverLetter,
                             @RequestParam(required = false) MultipartFile resumeFile,
                             Authentication authentication,
                             RedirectAttributes redirectAttributes) {
        try {
            User student = getCurrentUser(authentication);
            Job job = jobService.findById(jobId);
            applicationService.applyToJob(student, job, coverLetter, resumeFile);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Application submitted successfully for: " + job.getTitle());
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/jobs/" + jobId;
    }

    @GetMapping("/applications")
    public String myApplications(Authentication authentication, Model model) {
        User student = getCurrentUser(authentication);
        List<Application> applications = applicationService.findByStudent(student.getId());
        model.addAttribute("applications", applications);
        return "student/my-applications";
    }

    private User getCurrentUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
