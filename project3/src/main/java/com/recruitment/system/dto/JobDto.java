package com.recruitment.system.dto;

import com.recruitment.system.model.enums.JobCategory;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {

    private Long id;

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    private String location;

    private JobCategory category;

    private String skillsRequired;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experienceRequired;

    @Min(value = 0, message = "Salary cannot be negative")
    private Double salary;

    private String deadline;
}
