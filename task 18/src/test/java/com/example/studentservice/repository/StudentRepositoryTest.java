package com.example.studentservice.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.studentservice.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    StudentRepository repo;

    @Test
    void testRepo() {
        Student s = new Student(1, "John");
        Student saved = repo.save(s);
        assertEquals("John", saved.getName());
    }
}
