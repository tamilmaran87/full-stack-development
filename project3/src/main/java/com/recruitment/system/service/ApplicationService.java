package com.recruitment.system.service;

import com.recruitment.system.model.Application;
import com.recruitment.system.model.Job;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.ApplicationStatus;
import com.recruitment.system.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final FileStorageService fileStorageService;

    public Application applyToJob(User student, Job job, String coverLetter, MultipartFile resumeFile) {
        // Check if already applied
        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), job.getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        String resumePath = null;
        if (resumeFile != null && !resumeFile.isEmpty()) {
            resumePath = fileStorageService.storeFile(resumeFile);
        } else if (student.getResumePath() != null) {
            // Use profile resume if no new one uploaded
            resumePath = student.getResumePath();
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .coverLetter(coverLetter)
                .resumePath(resumePath)
                .status(ApplicationStatus.APPLIED)
                .build();

        return applicationRepository.save(application);
    }

    public Application updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = findById(applicationId);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }

    public List<Application> findByStudent(Long studentId) {
        return applicationRepository.findByStudentIdOrderByAppliedDateDesc(studentId);
    }

    public List<Application> findByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> findByEmployer(Long employerId) {
        return applicationRepository.findByJobEmployerIdOrderByAppliedDateDesc(employerId);
    }

    public List<Application> findByJobAndStatus(Long jobId, ApplicationStatus status) {
        return applicationRepository.findByJobIdAndOptionalStatus(jobId, status);
    }

    public boolean hasApplied(Long studentId, Long jobId) {
        return applicationRepository.existsByStudentIdAndJobId(studentId, jobId);
    }

    // Analytics
    public long countAll() {
        return applicationRepository.count();
    }

    public long countByStatus(ApplicationStatus status) {
        return applicationRepository.countByStatus(status);
    }

    public long countByEmployer(Long employerId) {
        return applicationRepository.countByJobEmployerId(employerId);
    }

    public long countByEmployerAndStatus(Long employerId, ApplicationStatus status) {
        return applicationRepository.countByJobEmployerIdAndStatus(employerId, status);
    }

    public long countByStudent(Long studentId) {
        return applicationRepository.countByStudentId(studentId);
    }

    public long countByStudentAndStatus(Long studentId, ApplicationStatus status) {
        return applicationRepository.countByStudentIdAndStatus(studentId, status);
    }
}
