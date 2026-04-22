package com.example.studentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.studentservice.entity.Student;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
