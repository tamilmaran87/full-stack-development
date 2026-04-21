package com.recruitment.system.controller;

import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.ApplicationStatus;
import com.recruitment.system.model.enums.Role;
import com.recruitment.system.service.ApplicationService;
import com.recruitment.system.service.JobService;
import com.recruitment.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Key metrics
        model.addAttribute("totalStudents", userService.countByRole(Role.STUDENT));
        model.addAttribute("totalEmployers", userService.countByRole(Role.EMPLOYER));
        model.addAttribute("totalJobs", jobService.countAll());
        model.addAttribute("activeJobs", jobService.countActiveJobs());
        model.addAttribute("totalApplications", applicationService.countAll());

        // Application status breakdown
        model.addAttribute("applied", applicationService.countByStatus(ApplicationStatus.APPLIED));
        model.addAttribute("shortlisted", applicationService.countByStatus(ApplicationStatus.SHORTLISTED));
        model.addAttribute("interviews", applicationService.countByStatus(ApplicationStatus.INTERVIEW));
        model.addAttribute("hired", applicationService.countByStatus(ApplicationStatus.HIRED));
        model.addAttribute("rejected", applicationService.countByStatus(ApplicationStatus.REJECTED));

        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String manageUsers(@RequestParam(required = false) String search,
                              @RequestParam(required = false) Role role,
                              Model model) {
        List<User> users;
        if (search != null && !search.isBlank()) {
            users = userService.searchUsers(search);
        } else if (role != null) {
            users = userService.findByRole(role);
        } else {
            users = userService.findAllUsers();
        }

        model.addAttribute("users", users);
        model.addAttribute("roles", Role.values());
        model.addAttribute("search", search);
        model.addAttribute("selectedRole", role);
        return "admin/manage-users";
    }

    @PostMapping("/users/{id}/toggle")
    public String toggleUserStatus(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userService.toggleUserStatus(id);
        redirectAttributes.addFlashAttribute("successMessage", "User status updated!");
        return "redirect:/admin/users";
    }
}
