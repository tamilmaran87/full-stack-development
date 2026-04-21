package com.recruitment.system.service;

import com.recruitment.system.dto.JobDto;
import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.JobCategory;
import com.recruitment.system.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(JobDto dto, User employer) {
        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .category(dto.getCategory())
                .skillsRequired(dto.getSkillsRequired())
                .experienceRequired(dto.getExperienceRequired())
                .salary(dto.getSalary())
                .deadline(dto.getDeadline() != null && !dto.getDeadline().isEmpty()
                        ? LocalDate.parse(dto.getDeadline()) : null)
                .employer(employer)
                .active(true)
                .build();

        return jobRepository.save(job);
    }

    public Job updateJob(Long jobId, JobDto dto, Long employerId) {
        Job job = findById(jobId);
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("You are not authorized to edit this job");
        }

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setCategory(dto.getCategory());
        job.setSkillsRequired(dto.getSkillsRequired());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setSalary(dto.getSalary());
        if (dto.getDeadline() != null && !dto.getDeadline().isEmpty()) {
            job.setDeadline(LocalDate.parse(dto.getDeadline()));
        }

        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, Long employerId) {
        Job job = findById(jobId);
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("You are not authorized to delete this job");
        }
        jobRepository.delete(job);
    }

    public Job findById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    public List<Job> findActiveJobs() {
        return jobRepository.findByActiveTrueOrderByPostedDateDesc();
    }

    public List<Job> findByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    public List<Job> searchJobs(String keyword, JobCategory category, String location, Integer experience) {
        return jobRepository.searchJobs(
                keyword != null && keyword.isBlank() ? null : keyword,
                category,
                location != null && location.isBlank() ? null : location,
                experience
        );
    }

    public void toggleJobStatus(Long jobId, Long employerId) {
        Job job = findById(jobId);
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("You are not authorized to modify this job");
        }
        job.setActive(!job.isActive());
        jobRepository.save(job);
    }

    public long countActiveJobs() {
        return jobRepository.countByActiveTrue();
    }

    public long countByEmployer(Long employerId) {
        return jobRepository.countByEmployerId(employerId);
    }

    public long countAll() {
        return jobRepository.count();
    }
}
