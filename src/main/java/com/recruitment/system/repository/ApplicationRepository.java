package com.recruitment.system.repository;

import com.recruitment.system.model.Application;
import com.recruitment.system.model.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentIdOrderByAppliedDateDesc(Long studentId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByJobEmployerIdOrderByAppliedDateDesc(Long employerId);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    long countByStatus(ApplicationStatus status);

    long countByJobEmployerId(Long employerId);

    long countByJobEmployerIdAndStatus(Long employerId, ApplicationStatus status);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.job.id = :jobId AND " +
           "(:status IS NULL OR a.status = :status) " +
           "ORDER BY a.appliedDate DESC")
    List<Application> findByJobIdAndOptionalStatus(@Param("jobId") Long jobId,
                                                    @Param("status") ApplicationStatus status);
}
