package com.recruitment.system.controller;

import com.recruitment.system.dto.JobDto;
import com.recruitment.system.model.Application;
import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.ApplicationStatus;
import com.recruitment.system.model.enums.JobCategory;
import com.recruitment.system.service.ApplicationService;
import com.recruitment.system.service.JobService;
import com.recruitment.system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/employer")
@RequiredArgsConstructor
public class EmployerController {

    private final UserService userService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        User employer = getCurrentUser(authentication);

        model.addAttribute("user", employer);
        model.addAttribute("totalJobs", jobService.countByEmployer(employer.getId()));
        model.addAttribute("totalApplications", applicationService.countByEmployer(employer.getId()));
        model.addAttribute("shortlisted",
                applicationService.countByEmployerAndStatus(employer.getId(), ApplicationStatus.SHORTLISTED));
        model.addAttribute("interviews",
                applicationService.countByEmployerAndStatus(employer.getId(), ApplicationStatus.INTERVIEW));
        model.addAttribute("hired",
                applicationService.countByEmployerAndStatus(employer.getId(), ApplicationStatus.HIRED));

        List<Application> recentApps = applicationService.findByEmployer(employer.getId());
        if (recentApps.size() > 5) {
            recentApps = recentApps.subList(0, 5);
        }
        model.addAttribute("recentApplications", recentApps);

        return "employer/dashboard";
    }

    @GetMapping("/jobs")
    public String myJobs(Authentication authentication, Model model) {
        User employer = getCurrentUser(authentication);
        List<Job> jobs = jobService.findByEmployer(employer.getId());
        model.addAttribute("jobs", jobs);
        return "employer/my-jobs";
    }

    @GetMapping("/jobs/new")
    public String createJobForm(Model model) {
        model.addAttribute("job", new JobDto());
        model.addAttribute("categories", JobCategory.values());
        return "jobs/create";
    }

    @PostMapping("/jobs")
    public String createJob(@Valid @ModelAttribute("job") JobDto dto,
                            BindingResult result,
                            Authentication authentication,
                            Model model,
                            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("categories", JobCategory.values());
            return "jobs/create";
        }

        User employer = getCurrentUser(authentication);
        jobService.createJob(dto, employer);
        redirectAttributes.addFlashAttribute("successMessage", "Job posted successfully!");
        return "redirect:/employer/jobs";
    }

    @GetMapping("/jobs/{id}/edit")
    public String editJobForm(@PathVariable Long id, Authentication authentication, Model model) {
        User employer = getCurrentUser(authentication);
        Job job = jobService.findById(id);

        if (!job.getEmployer().getId().equals(employer.getId())) {
            return "redirect:/employer/jobs";
        }

        JobDto dto = JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .category(job.getCategory())
                .skillsRequired(job.getSkillsRequired())
                .experienceRequired(job.getExperienceRequired())
                .salary(job.getSalary())
                .deadline(job.getDeadline() != null ? job.getDeadline().toString() : "")
                .build();

        model.addAttribute("job", dto);
        model.addAttribute("categories", JobCategory.values());
        return "jobs/edit";
    }

    @PostMapping("/jobs/{id}")
    public String updateJob(@PathVariable Long id,
                            @Valid @ModelAttribute("job") JobDto dto,
                            BindingResult result,
                            Authentication authentication,
                            Model model,
                            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("categories", JobCategory.values());
            return "jobs/edit";
        }

        User employer = getCurrentUser(authentication);
        jobService.updateJob(id, dto, employer.getId());
        redirectAttributes.addFlashAttribute("successMessage", "Job updated successfully!");
        return "redirect:/employer/jobs";
    }

    @PostMapping("/jobs/{id}/delete")
    public String deleteJob(@PathVariable Long id,
                            Authentication authentication,
                            RedirectAttributes redirectAttributes) {
        User employer = getCurrentUser(authentication);
        jobService.deleteJob(id, employer.getId());
        redirectAttributes.addFlashAttribute("successMessage", "Job deleted successfully!");
        return "redirect:/employer/jobs";
    }

    @PostMapping("/jobs/{id}/toggle")
    public String toggleJobStatus(@PathVariable Long id,
                                  Authentication authentication,
                                  RedirectAttributes redirectAttributes) {
        User employer = getCurrentUser(authentication);
        jobService.toggleJobStatus(id, employer.getId());
        redirectAttributes.addFlashAttribute("successMessage", "Job status updated!");
        return "redirect:/employer/jobs";
    }

    @GetMapping("/jobs/{id}/applicants")
    public String viewApplicants(@PathVariable Long id,
                                 @RequestParam(required = false) ApplicationStatus status,
                                 Authentication authentication,
                                 Model model) {
        User employer = getCurrentUser(authentication);
        Job job = jobService.findById(id);

        if (!job.getEmployer().getId().equals(employer.getId())) {
            return "redirect:/employer/jobs";
        }

        List<Application> applications = applicationService.findByJobAndStatus(id, status);
        model.addAttribute("job", job);
        model.addAttribute("applications", applications);
        model.addAttribute("statuses", ApplicationStatus.values());
        model.addAttribute("selectedStatus", status);
        return "employer/applicants";
    }

    @PostMapping("/applications/{id}/status")
    public String updateApplicationStatus(@PathVariable Long id,
                                          @RequestParam ApplicationStatus status,
                                          @RequestParam Long jobId,
                                          RedirectAttributes redirectAttributes) {
        applicationService.updateStatus(id, status);
        redirectAttributes.addFlashAttribute("successMessage", "Application status updated to: " + status);
        return "redirect:/employer/jobs/" + jobId + "/applicants";
    }

    private User getCurrentUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
