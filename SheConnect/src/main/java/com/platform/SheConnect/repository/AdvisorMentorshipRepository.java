package com.platform.SheConnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.platform.SheConnect.entity.AdvisorMentorship;

@Repository
public interface AdvisorMentorshipRepository extends JpaRepository<AdvisorMentorship, Long> {

    List<AdvisorMentorship> findByAdvisorIdAndStatus(Long advisorId, String status);

    List<AdvisorMentorship> findByAdvisorId(Long advisorId);

    Optional<AdvisorMentorship> findByAdvisorIdAndStartupIdeaId(Long advisorId, Long startupIdeaId);

    boolean existsByAdvisorIdAndStartupIdeaId(Long advisorId, Long startupIdeaId);

    long countByAdvisorIdAndStatus(Long advisorId, String status);

    /** Active mentorships with a scheduled session in the future for this advisor */
    @Query("SELECT m FROM AdvisorMentorship m WHERE m.advisor.id = :advisorId AND m.status = 'ACTIVE' AND m.sessionScheduledAt IS NOT NULL AND m.sessionScheduledAt >= CURRENT_TIMESTAMP ORDER BY m.sessionScheduledAt ASC")
    List<AdvisorMentorship> findUpcomingSessionsByAdvisorId(@Param("advisorId") Long advisorId);

    /** Count distinct active mentees for an advisor */
    @Query("SELECT COUNT(DISTINCT m.mentee.id) FROM AdvisorMentorship m WHERE m.advisor.id = :advisorId AND m.status = 'ACTIVE'")
    long countActiveMenteesByAdvisorId(@Param("advisorId") Long advisorId);
}
