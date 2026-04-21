package com.recruitment.system.util;

import com.recruitment.system.model.Application;
import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.ApplicationStatus;
import com.recruitment.system.model.enums.JobCategory;
import com.recruitment.system.model.enums.Role;
import com.recruitment.system.repository.ApplicationRepository;
import com.recruitment.system.repository.JobRepository;
import com.recruitment.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping data seeding.");
            return;
        }

        log.info("Initializing database with sample data...");

        // Create Admin
        User admin = User.builder()
                .fullName("System Administrator")
                .email("admin@company.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Create Employers
        User employer1 = User.builder()
                .fullName("Rajesh Kumar")
                .email("rajesh@techcorp.com")
                .password(passwordEncoder.encode("employer123"))
                .phone("9876543210")
                .role(Role.EMPLOYER)
                .enabled(true)
                .build();
        userRepository.save(employer1);

        User employer2 = User.builder()
                .fullName("Priya Sharma")
                .email("priya@innovatesoft.com")
                .password(passwordEncoder.encode("employer123"))
                .phone("9876543211")
                .role(Role.EMPLOYER)
                .enabled(true)
                .build();
        userRepository.save(employer2);

        // Create Students
        User student1 = User.builder()
                .fullName("Amit Patel")
                .email("amit@student.com")
                .password(passwordEncoder.encode("student123"))
                .phone("9876543220")
                .skills("Java, Spring Boot, MySQL, React")
                .experience(2)
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(student1);

        User student2 = User.builder()
                .fullName("Sneha Reddy")
                .email("sneha@student.com")
                .password(passwordEncoder.encode("student123"))
                .phone("9876543221")
                .skills("Python, Django, PostgreSQL, Machine Learning")
                .experience(1)
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(student2);

        User student3 = User.builder()
                .fullName("Vikram Singh")
                .email("vikram@student.com")
                .password(passwordEncoder.encode("student123"))
                .phone("9876543222")
                .skills("JavaScript, Node.js, Angular, MongoDB")
                .experience(3)
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(student3);

        // Create Jobs
        Job job1 = Job.builder()
                .title("Senior Java Developer")
                .description("We are looking for an experienced Java Developer to join our team. " +
                        "You will be responsible for designing and implementing high-performance applications " +
                        "using Spring Boot and microservices architecture. The ideal candidate should have " +
                        "strong problem-solving skills and experience with RESTful APIs, JPA/Hibernate, and cloud platforms.")
                .location("Bangalore")
                .category(JobCategory.IT)
                .skillsRequired("Java, Spring Boot, Microservices, REST APIs, JPA, MySQL")
                .experienceRequired(3)
                .salary(1200000.0)
                .deadline(LocalDate.now().plusDays(30))
                .employer(employer1)
                .active(true)
                .build();
        jobRepository.save(job1);

        Job job2 = Job.builder()
                .title("Full Stack Developer")
                .description("Join our innovative team as a Full Stack Developer. You will work on both " +
                        "frontend and backend technologies to build responsive web applications. " +
                        "Experience with modern JavaScript frameworks and backend technologies is required.")
                .location("Hyderabad")
                .category(JobCategory.IT)
                .skillsRequired("React, Node.js, TypeScript, MongoDB, Express.js")
                .experienceRequired(2)
                .salary(900000.0)
                .deadline(LocalDate.now().plusDays(45))
                .employer(employer1)
                .active(true)
                .build();
        jobRepository.save(job2);

        Job job3 = Job.builder()
                .title("Digital Marketing Manager")
                .description("We are seeking a creative Digital Marketing Manager to lead our online marketing " +
                        "efforts. The role involves planning and executing digital campaigns across multiple " +
                        "channels including social media, SEO, SEM, and email marketing.")
                .location("Mumbai")
                .category(JobCategory.MARKETING)
                .skillsRequired("SEO, SEM, Social Media Marketing, Google Analytics, Content Strategy")
                .experienceRequired(4)
                .salary(800000.0)
                .deadline(LocalDate.now().plusDays(20))
                .employer(employer2)
                .active(true)
                .build();
        jobRepository.save(job3);

        Job job4 = Job.builder()
                .title("UI/UX Designer")
                .description("We're looking for a talented UI/UX Designer to create intuitive and engaging " +
                        "user experiences. You will collaborate closely with product managers and engineers " +
                        "to translate user needs into beautiful, functional designs.")
                .location("Pune")
                .category(JobCategory.DESIGN)
                .skillsRequired("Figma, Adobe XD, Sketch, Wireframing, Prototyping, User Research")
                .experienceRequired(2)
                .salary(700000.0)
                .deadline(LocalDate.now().plusDays(25))
                .employer(employer2)
                .active(true)
                .build();
        jobRepository.save(job4);

        Job job5 = Job.builder()
                .title("Data Analyst")
                .description("Join our data team as a Data Analyst. You will analyze complex data sets, " +
                        "build dashboards and reports, and provide actionable insights to drive business decisions. " +
                        "Proficiency in SQL and data visualization tools is essential.")
                .location("Chennai")
                .category(JobCategory.IT)
                .skillsRequired("SQL, Python, Tableau, Power BI, Excel, Statistics")
                .experienceRequired(1)
                .salary(600000.0)
                .deadline(LocalDate.now().plusDays(35))
                .employer(employer1)
                .active(true)
                .build();
        jobRepository.save(job5);

        Job job6 = Job.builder()
                .title("HR Business Partner")
                .description("We are looking for an experienced HR Business Partner to support our growing team. " +
                        "You will be responsible for employee relations, talent management, performance reviews, " +
                        "and implementing HR initiatives aligned with business objectives.")
                .location("Delhi")
                .category(JobCategory.HR)
                .skillsRequired("Talent Management, Employee Relations, HRIS, Recruitment, Performance Management")
                .experienceRequired(5)
                .salary(1000000.0)
                .deadline(LocalDate.now().plusDays(15))
                .employer(employer2)
                .active(true)
                .build();
        jobRepository.save(job6);

        // Create Applications
        Application app1 = Application.builder()
                .student(student1)
                .job(job1)
                .coverLetter("I am very interested in this Senior Java Developer position. With 2 years of experience in Java and Spring Boot, I believe I can contribute effectively to your team.")
                .status(ApplicationStatus.SHORTLISTED)
                .build();
        applicationRepository.save(app1);

        Application app2 = Application.builder()
                .student(student1)
                .job(job2)
                .coverLetter("I would love to join as a Full Stack Developer. My experience with both frontend and backend technologies makes me a strong fit.")
                .status(ApplicationStatus.APPLIED)
                .build();
        applicationRepository.save(app2);

        Application app3 = Application.builder()
                .student(student2)
                .job(job5)
                .coverLetter("As a passionate data enthusiast with experience in Python and SQL, I am excited about this Data Analyst opportunity.")
                .status(ApplicationStatus.INTERVIEW)
                .build();
        applicationRepository.save(app3);

        Application app4 = Application.builder()
                .student(student3)
                .job(job2)
                .coverLetter("With 3 years of experience in JavaScript and Node.js, I am confident in my ability to excel as a Full Stack Developer.")
                .status(ApplicationStatus.HIRED)
                .build();
        applicationRepository.save(app4);

        Application app5 = Application.builder()
                .student(student2)
                .job(job4)
                .coverLetter("I have a keen eye for design and user experience. I would love to contribute to your team as a UI/UX Designer.")
                .status(ApplicationStatus.REJECTED)
                .build();
        applicationRepository.save(app5);

        log.info("Database initialized with sample data successfully!");
        log.info("===========================================");
        log.info("  LOGIN CREDENTIALS:");
        log.info("  Admin:    admin@company.com / admin123");
        log.info("  Employer: rajesh@techcorp.com / employer123");
        log.info("  Employer: priya@innovatesoft.com / employer123");
        log.info("  Student:  amit@student.com / student123");
        log.info("  Student:  sneha@student.com / student123");
        log.info("  Student:  vikram@student.com / student123");
        log.info("===========================================");
    }
}
