package com.recruitment.system.controller;

import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.JobCategory;
import com.recruitment.system.service.ApplicationService;
import com.recruitment.system.service.JobService;
import com.recruitment.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final UserService userService;
    private final ApplicationService applicationService;

    @GetMapping
    public String listJobs(@RequestParam(required = false) String keyword,
                           @RequestParam(required = false) JobCategory category,
                           @RequestParam(required = false) String location,
                           @RequestParam(required = false) Integer experience,
                           Model model) {
        List<Job> jobs;
        if (keyword != null || category != null || location != null || experience != null) {
            jobs = jobService.searchJobs(keyword, category, location, experience);
        } else {
            jobs = jobService.findActiveJobs();
        }

        model.addAttribute("jobs", jobs);
        model.addAttribute("categories", JobCategory.values());
        model.addAttribute("keyword", keyword);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("location", location);
        model.addAttribute("experience", experience);
        return "jobs/list";
    }

    @GetMapping("/{id}")
    public String jobDetail(@PathVariable Long id, Model model, Authentication authentication) {
        Job job = jobService.findById(id);
        model.addAttribute("job", job);

        if (authentication != null) {
            User user = userService.findByEmail(authentication.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("hasApplied",
                        applicationService.hasApplied(user.getId(), id));
                model.addAttribute("currentUser", user);
            }
        }

        return "jobs/detail";
    }
}
