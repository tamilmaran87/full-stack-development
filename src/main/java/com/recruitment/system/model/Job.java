package com.recruitment.system.model;

import com.recruitment.system.model.enums.JobCategory;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private JobCategory category;

    @Column(length = 1000)
    private String skillsRequired;

    private Integer experienceRequired;

    private Double salary;

    private LocalDate postedDate;

    private LocalDate deadline;

    private boolean active = true;

    // Many-to-One → Employer (User)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    // One-to-Many → Applications
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.postedDate == null) {
            this.postedDate = LocalDate.now();
        }
    }
}
