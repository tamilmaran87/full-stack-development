package com.recruitment.system.controller;

import com.recruitment.system.model.Job;
import com.recruitment.system.service.JobService;
import com.recruitment.system.service.UserService;
import com.recruitment.system.model.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final JobService jobService;
    private final UserService userService;

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        List<Job> latestJobs = jobService.findActiveJobs();
        // Limit to 6 featured jobs on home page
        if (latestJobs.size() > 6) {
            latestJobs = latestJobs.subList(0, 6);
        }
        model.addAttribute("jobs", latestJobs);
        model.addAttribute("totalJobs", jobService.countActiveJobs());
        model.addAttribute("totalEmployers", userService.countByRole(Role.EMPLOYER));
        model.addAttribute("totalStudents", userService.countByRole(Role.STUDENT));
        return "home";
    }
}
