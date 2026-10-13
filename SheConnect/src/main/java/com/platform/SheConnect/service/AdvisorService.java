package com.platform.SheConnect.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.dto.AdvisorDashboardResponse;
import com.platform.SheConnect.dto.AdvisorDashboardResponse.ActivityDto;
import com.platform.SheConnect.dto.AdvisorDashboardResponse.MentorshipDto;
import com.platform.SheConnect.dto.AdvisorDashboardResponse.PendingRequestDto;
import com.platform.SheConnect.dto.AdvisorDashboardResponse.SessionDto;
import com.platform.SheConnect.entity.AdvisorMentorship;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.AdvisorMentorshipRepository;

@Service
public class AdvisorService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdvisorService.class);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    private final AdvisorMentorshipRepository mentorshipRepository;

    public AdvisorService(AdvisorMentorshipRepository mentorshipRepository) {
        this.mentorshipRepository = mentorshipRepository;
    }

    // -----------------------------------------------------------------------
    // Dashboard
    // -----------------------------------------------------------------------

    public AdvisorDashboardResponse getDashboard(User advisor) {
        Long advisorId = advisor.getId();
        AdvisorDashboardResponse resp = new AdvisorDashboardResponse();

        // ---- Advisor profile info ----
        resp.setAdvisorName(advisor.getName());
        resp.setAdvisorTitle(advisor.getTitle() != null ? advisor.getTitle() : "Advisor");
        resp.setAdvisorInitials(buildInitials(advisor.getName()));
        resp.setAcceptingStartups(true); // can be stored as a User field later

        // ---- Stat counts ----
        long activeMentees = mentorshipRepository.countActiveMenteesByAdvisorId(advisorId);
        long pendingCount = mentorshipRepository.countByAdvisorIdAndStatus(advisorId, "PENDING");
        List<AdvisorMentorship> upcomingSessions = mentorshipRepository.findUpcomingSessionsByAdvisorId(advisorId);

        resp.setActiveMentees(activeMentees);
        resp.setPendingRequests(pendingCount);
        resp.setUpcomingSessionsCount(upcomingSessions.size());
        resp.setAdvisoryHoursThisMonth(0.0); // placeholder; can track via a separate hours table

        // ---- Upcoming sessions ----
        resp.setUpcomingSessions(mapSessions(upcomingSessions));

        // ---- Active mentorships ----
        List<AdvisorMentorship> active = mentorshipRepository.findByAdvisorIdAndStatus(advisorId, "ACTIVE");
        resp.setActiveMentorships(mapMentorships(active));

        // ---- Pending requests ----
        List<AdvisorMentorship> pending = mentorshipRepository.findByAdvisorIdAndStatus(advisorId, "PENDING");
        resp.setPendingRequestList(mapPendingRequests(pending));

        // ---- Recent activity (from recently-updated active mentorships) ----
        resp.setRecentActivity(buildActivityFeed(active));

        return resp;
    }

    // -----------------------------------------------------------------------
    // Request management
    // -----------------------------------------------------------------------

    public AdvisorMentorship acceptRequest(Long mentorshipId, User advisor) {
        AdvisorMentorship m = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new com.platform.SheConnect.exception.ResourceNotFoundException(
                        "Mentorship request not found: " + mentorshipId));
        if (!m.getAdvisor().getId().equals(advisor.getId())) {
            throw new SecurityException("Not authorized to modify this request");
        }
        m.setStatus("ACTIVE");
        m.setMentorshipType("Mentorship");
        return mentorshipRepository.save(m);
    }

    public AdvisorMentorship declineRequest(Long mentorshipId, User advisor) {
        AdvisorMentorship m = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new com.platform.SheConnect.exception.ResourceNotFoundException(
                        "Mentorship request not found: " + mentorshipId));
        if (!m.getAdvisor().getId().equals(advisor.getId())) {
            throw new SecurityException("Not authorized to modify this request");
        }
        m.setStatus("DECLINED");
        return mentorshipRepository.save(m);
    }

    // -----------------------------------------------------------------------
    // Mapping helpers
    // -----------------------------------------------------------------------

    private List<SessionDto> mapSessions(List<AdvisorMentorship> mentorships) {
        List<SessionDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (AdvisorMentorship m : mentorships) {
            if (m.getSessionScheduledAt() == null) continue;
            SessionDto dto = new SessionDto();
            dto.setId(m.getId());
            dto.setDay(friendlyDay(m.getSessionScheduledAt(), now));
            dto.setTime(m.getSessionScheduledAt().format(TIME_FMT));
            dto.setFounder(m.getMentee().getName());
            dto.setStartup(startupName(m));
            dto.setAgenda(m.getSessionAgenda() != null ? m.getSessionAgenda() : "Advisory Session");
            result.add(dto);
        }
        return result;
    }

    private List<MentorshipDto> mapMentorships(List<AdvisorMentorship> mentorships) {
        List<MentorshipDto> result = new ArrayList<>();
        for (AdvisorMentorship m : mentorships) {
            MentorshipDto dto = new MentorshipDto();
            dto.setId(m.getId());
            dto.setStartup(startupName(m));
            dto.setLogo(buildInitials(startupName(m)));
            dto.setFounder(m.getMentee().getName());
            dto.setStatus(m.getMentorshipType() != null ? m.getMentorshipType() : "Mentorship");
            dto.setStatusClass("active-equity");
            dto.setSprintGoal(m.getSprintGoal() != null ? m.getSprintGoal() : "No goal set");
            result.add(dto);
        }
        return result;
    }

    private List<PendingRequestDto> mapPendingRequests(List<AdvisorMentorship> mentorships) {
        List<PendingRequestDto> result = new ArrayList<>();
        for (AdvisorMentorship m : mentorships) {
            PendingRequestDto dto = new PendingRequestDto();
            dto.setId(m.getId());
            dto.setStartup(startupName(m));
            dto.setFounder(m.getMentee().getName());
            dto.setMessage(m.getRequestMessage() != null ? m.getRequestMessage() : "Requesting mentorship guidance.");
            result.add(dto);
        }
        return result;
    }

    private List<ActivityDto> buildActivityFeed(List<AdvisorMentorship> activeMentorships) {
        List<ActivityDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (AdvisorMentorship m : activeMentorships) {
            if (m.getSprintGoal() != null && m.getUpdatedAt() != null) {
                ActivityDto dto = new ActivityDto();
                dto.setId(m.getId());
                dto.setType("milestone");
                dto.setContent(m.getMentee().getName() + " is working on: \"" + m.getSprintGoal() + "\".");
                dto.setTime(friendlyTime(m.getUpdatedAt(), now));
                result.add(dto);
            }
        }
        return result;
    }

    // -----------------------------------------------------------------------
    // Utility
    // -----------------------------------------------------------------------

    private String buildInitials(String name) {
        if (name == null || name.isBlank()) return "?";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    private String startupName(AdvisorMentorship mentorship) {
        if (mentorship.getStartupIdea() != null && mentorship.getStartupIdea().getTitle() != null) {
            return mentorship.getStartupIdea().getTitle();
        }
        if (mentorship.getMentee().getTitle() != null) {
            return mentorship.getMentee().getTitle();
        }
        return mentorship.getMentee().getName();
    }

    private String friendlyDay(LocalDateTime session, LocalDateTime now) {
        long days = Duration.between(now.toLocalDate().atStartOfDay(), session.toLocalDate().atStartOfDay()).toDays();
        if (days == 0) return "Today";
        if (days == 1) return "Tomorrow";
        return session.toLocalDate().format(DateTimeFormatter.ofPattern("MMM d"));
    }

    private String friendlyTime(LocalDateTime past, LocalDateTime now) {
        long minutes = Duration.between(past, now).toMinutes();
        if (minutes < 60) return minutes + " minutes ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}
