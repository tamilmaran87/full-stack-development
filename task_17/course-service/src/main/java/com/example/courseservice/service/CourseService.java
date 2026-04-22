package com.example.courseservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CourseService {
    @Autowired
    private RestTemplate restTemplate;

    private final String STUDENT_URL = "http://localhost:8081/students";

    @CircuitBreaker(name = "studentService", fallbackMethod = "fallbackMethod")
    public Object getStudentData() {
        return restTemplate.getForObject(STUDENT_URL, Object.class);
    }

    public Object fallbackMethod(Exception e) {
        return "Fallback: Student Service Down! Error: " + e.getMessage();
    }
}
