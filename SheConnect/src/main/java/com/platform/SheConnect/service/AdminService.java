package com.platform.SheConnect.service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platform.SheConnect.dto.AdminDashboardResponse;
import com.platform.SheConnect.dto.AdminDashboardResponse.AdminIdeaDto;
import com.platform.SheConnect.dto.AdminDashboardResponse.AdminIndustryDto;
import com.platform.SheConnect.dto.AdminDashboardResponse.AdminUserDto;
import com.platform.SheConnect.entity.*;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.*;

@Service
@Transactional
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StartUpIdeaRepository startUpIdeaRepository;
    private final IndustryRepository industryRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final InvestorInterestRepository investorInterestRepository;

    public AdminService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            StartUpIdeaRepository startUpIdeaRepository,
            IndustryRepository industryRepository,
            LikeRepository likeRepository,
            CommentRepository commentRepository,
            InvestorInterestRepository investorInterestRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.industryRepository = industryRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.investorInterestRepository = investorInterestRepository;
    }

    public AdminDashboardResponse getDashboardOverview() {
        // 1. Calculate Aggregate Statistics
        long totalUsers = userRepository.count();
        long entrepreneursCount = userRepository.countByRole_Name("ENTREPRENEUR");
        long investorsCount = userRepository.countByRole_Name("INVESTOR");
        long advisorsCount = userRepository.countByRole_Name("ADVISOR");
        long adminsCount = userRepository.countByRole_Name("ADMIN");

        long totalIdeas = startUpIdeaRepository.count();
        long totalLikes = likeRepository.count();
        long totalComments = commentRepository.count();
        long totalInterests = investorInterestRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("entrepreneursCount", entrepreneursCount);
        stats.put("investorsCount", investorsCount);
        stats.put("advisorsCount", advisorsCount);
        stats.put("adminsCount", adminsCount);
        stats.put("totalIdeas", totalIdeas);
        stats.put("totalLikes", totalLikes);
        stats.put("totalComments", totalComments);
        stats.put("totalInterests", totalInterests);

        // 2. Map Users
        List<User> allUsers = userRepository.findAll();
        List<AdminUserDto> userDtos = allUsers.stream()
                .sorted(Comparator.comparing(User::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToUserDto)
                .collect(Collectors.toList());

        // 3. Map Ideas
        List<StartUpIdea> allIdeas = startUpIdeaRepository.findAll();
        List<AdminIdeaDto> ideaDtos = allIdeas.stream()
                .sorted(Comparator.comparing(StartUpIdea::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToIdeaDto)
                .collect(Collectors.toList());

        // 4. Map Industries with Idea Count
        List<Industry> allIndustries = industryRepository.findAll();
        Map<String, Long> industryCounts = allIdeas.stream()
                .map(idea -> {
                    try {
                        return idea.getIndustry() != null ? idea.getIndustry().getName() : "Unassigned";
                    } catch (Exception e) {
                        return "Unassigned";
                    }
                })
                .collect(Collectors.groupingBy(name -> name, Collectors.counting()));

        List<AdminIndustryDto> industryDtos = allIndustries.stream()
                .map(ind -> new AdminIndustryDto(
                        ind.getId(),
                        ind.getName(),
                        industryCounts.getOrDefault(ind.getName(), 0L)
                ))
                .collect(Collectors.toList());

        return new AdminDashboardResponse(stats, userDtos, ideaDtos, industryDtos);
    }

    public List<AdminUserDto> getUsers(String role, String search) {
        List<User> users;
        if (role != null && !role.isBlank() && !role.equalsIgnoreCase("ALL")) {
            users = userRepository.findAllByRole_Name(role.trim().toUpperCase());
        } else {
            users = userRepository.findAll();
        }

        if (search != null && !search.trim().isBlank()) {
            String q = search.trim().toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(q))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q))
                            || (u.getTitle() != null && u.getTitle().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return users.stream()
                .sorted(Comparator.comparing(User::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    public AdminUserDto updateUserRole(Long userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Role newRole = roleRepository.findByName(newRoleName.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + newRoleName));

        user.setRole(newRole);
        User saved = userRepository.save(user);
        log.info("Admin updated user {} ({}) to role {}", saved.getId(), saved.getEmail(), newRole.getName());
        return mapToUserDto(saved);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 1. Remove investor interested records where user is investor
        try {
            investorInterestRepository.deleteByInvestorId(userId);
        } catch (Exception e) {
            log.warn("Error cleaning up investor interests for user {}: {}", userId, e.getMessage());
        }

        // 2. Remove user likes and comments
        try {
            likeRepository.deleteByUserId(userId);
            commentRepository.deleteByUserId(userId);
        } catch (Exception e) {
            log.warn("Error cleaning up likes/comments for user {}: {}", userId, e.getMessage());
        }

        // 3. Remove user ideas and their investor interests
        try {
            List<StartUpIdea> userIdeas = startUpIdeaRepository.findAllByUser(user);
            for (StartUpIdea idea : userIdeas) {
                investorInterestRepository.deleteByStartUpIdeaId(idea.getId());
                startUpIdeaRepository.delete(idea);
            }
        } catch (Exception e) {
            log.warn("Error cleaning up ideas for user {}: {}", userId, e.getMessage());
        }

        userRepository.delete(user);
        log.info("Admin successfully deleted user {} ({})", userId, user.getEmail());
    }

    public List<AdminIdeaDto> getIdeas(String search, String industry) {
        List<StartUpIdea> ideas = startUpIdeaRepository.findAll();

        if (industry != null && !industry.isBlank() && !industry.equalsIgnoreCase("ALL")) {
            ideas = ideas.stream()
                    .filter(i -> {
                        try {
                            return i.getIndustry() != null && i.getIndustry().getName().equalsIgnoreCase(industry.trim());
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isBlank()) {
            String q = search.trim().toLowerCase();
            ideas = ideas.stream()
                    .filter(i -> (i.getTitle() != null && i.getTitle().toLowerCase().contains(q))
                            || (i.getDescription() != null && i.getDescription().toLowerCase().contains(q))
                            || (i.getProblem() != null && i.getProblem().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return ideas.stream()
                .sorted(Comparator.comparing(StartUpIdea::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToIdeaDto)
                .collect(Collectors.toList());
    }

    public void deleteIdea(Long ideaId) {
        StartUpIdea idea = startUpIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup idea not found with id: " + ideaId));

        try {
            investorInterestRepository.deleteByStartUpIdeaId(ideaId);
        } catch (Exception e) {
            log.warn("Could not delete investor interests for idea {}: {}", ideaId, e.getMessage());
        }

        startUpIdeaRepository.delete(idea);
        log.info("Admin deleted startup idea {} ('{}')", ideaId, idea.getTitle());
    }

    public Industry addIndustry(String name) {
        String trimmed = name.trim().toUpperCase();
        return industryRepository.findByNameIgnoreCase(trimmed)
                .orElseGet(() -> industryRepository.save(new Industry(null, trimmed)));
    }

    public void deleteIndustry(Long industryId) {
        Industry industry = industryRepository.findById(industryId)
                .orElseThrow(() -> new ResourceNotFoundException("Industry not found with id: " + industryId));
        industryRepository.delete(industry);
        log.info("Admin deleted industry {} ('{}')", industryId, industry.getName());
    }

    // --- Helper Mappings ---

    private AdminUserDto mapToUserDto(User user) {
        String roleName = "USER";
        try {
            if (user.getRole() != null) {
                roleName = user.getRole().getName();
            }
        } catch (Exception ignored) {}

        long ideasCount = 0;
        try {
            ideasCount = startUpIdeaRepository.countByUserId(user.getId());
        } catch (Exception ignored) {}

        String dateStr = "Recent";
        if (user.getCreatedAt() != null) {
            dateStr = user.getCreatedAt().format(DATE_FORMATTER);
        }

        return new AdminUserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roleName,
                user.getTitle() != null ? user.getTitle() : "",
                user.getLocation() != null ? user.getLocation() : "",
                dateStr,
                ideasCount
        );
    }

    private AdminIdeaDto mapToIdeaDto(StartUpIdea idea) {
        String industryName = "General";
        try {
            if (idea.getIndustry() != null) {
                industryName = idea.getIndustry().getName();
            }
        } catch (Exception ignored) {}

        List<String> lookingForList = new ArrayList<>();
        try {
            if (idea.getLookingFor() != null) {
                lookingForList = idea.getLookingFor().stream()
                        .map(EntrepreneurNeed::getName)
                        .collect(Collectors.toList());
            }
        } catch (Exception ignored) {}

        String founderName = "Entrepreneur";
        String founderEmail = "";
        try {
            if (idea.getUser() != null) {
                founderName = idea.getUser().getName();
                founderEmail = idea.getUser().getEmail();
            }
        } catch (Exception ignored) {}

        long likesCount = 0;
        long commentsCount = 0;
        try {
            likesCount = likeRepository.countByStartupIdeaId(idea.getId());
            commentsCount = commentRepository.countByStartupIdeaId(idea.getId());
        } catch (Exception ignored) {}

        String dateStr = "Recent";
        if (idea.getCreatedAt() != null) {
            dateStr = idea.getCreatedAt().format(DATE_FORMATTER);
        }

        return new AdminIdeaDto(
                idea.getId(),
                idea.getTitle(),
                idea.getDescription(),
                idea.getProblem(),
                idea.getSolution(),
                idea.getTargetMarket(),
                industryName,
                lookingForList,
                founderName,
                founderEmail,
                likesCount,
                commentsCount,
                dateStr
        );
    }
}
