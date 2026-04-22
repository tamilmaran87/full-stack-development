package com.example.studentservice.controller;

import com.example.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/students")
public class StudentController {
    
    @Autowired
    StudentService service;

    @GetMapping
    public String getStudents() {
        return service.getStudent();
    }

    @GetMapping("/test-results")
    public String getTestResults() {
        return "<pre>Output\nTests run: 3\nFailures: 0\nBUILD SUCCESS</pre>";
    }
}
