package com.recruitment.system.repository;

import com.recruitment.system.model.Job;
import com.recruitment.system.model.enums.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByEmployerId(Long employerId);

    List<Job> findByActiveTrueOrderByPostedDateDesc();

    List<Job> findByCategory(JobCategory category);

    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR j.category = :category) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:experience IS NULL OR j.experienceRequired <= :experience) " +
           "ORDER BY j.postedDate DESC")
    List<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("category") JobCategory category,
                         @Param("location") String location,
                         @Param("experience") Integer experience);

    long countByActiveTrue();

    long countByEmployerId(Long employerId);
}
