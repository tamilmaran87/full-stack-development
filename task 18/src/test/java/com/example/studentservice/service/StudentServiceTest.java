package com.example.studentservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StudentServiceTest {

    @Autowired
    StudentService service;

    @Test
    void testService() {
        assertEquals("Student Data", service.getStudent());
    }
}
