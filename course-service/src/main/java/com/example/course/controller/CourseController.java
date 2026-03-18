package com.example.course.controller;

import com.example.course.model.Course;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @GetMapping
    public List<Course> getCourses() {
        List<Course> courses = new ArrayList<>();
        courses.add(new Course(1, "Microservices"));
        courses.add(new Course(2, "Cloud Computing"));
        return courses;
    }
}
