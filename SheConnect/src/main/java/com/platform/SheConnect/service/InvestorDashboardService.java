package com.platform.SheConnect.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platform.SheConnect.dto.DealPipelineItemDto;
import com.platform.SheConnect.dto.InvestorPipelineResponse;
import com.platform.SheConnect.entity.InvestorInterested;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.InvestorInterestRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.repository.UserRepository;

@Service
public class InvestorDashboardService {
    private final StartUpIdeaRepository startUpIdeaRepository;
    private final InvestorInterestRepository investorInterestRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private UserRepository userRepository;

    public InvestorDashboardService(
            StartUpIdeaRepository startUpIdeaRepository,
            InvestorInterestRepository investorInterestRepository,
            CommentRepository commentRepository,
            LikeRepository likeRepository
    ) {
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.investorInterestRepository = investorInterestRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    @Autowired(required = false)
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<StartUpIdea> getAllStartUpIdea() {
        return startUpIdeaRepository.findAll();
    }

    public long getInvestorInterestCount(Long userId) {
        return investorInterestRepository.countByInvestorId(userId);
    }
    
    public long getTotalLikes(Long userId) {
        return likeRepository.countByUserId(userId);
    }

    public long getTotalComments(Long userId) {
        return commentRepository.countByUserId(userId);
    }

    public List<StartUpIdea> getIdeasByEntrepreneurNeed(String entrepreneurNeed) {
        return startUpIdeaRepository.findAllByLookingFor_Name(entrepreneurNeed);
    }

    @Transactional(readOnly = true)
    public InvestorPipelineResponse getInvestorPipeline(Long investorId) {
        // 1. Fetch ideas looking for INVESTOR or BOTH, plus any ideas investor has shortlisted
        List<StartUpIdea> investorNeedIdeas = startUpIdeaRepository.findAllByLookingFor_Name("INVESTOR");
        List<StartUpIdea> bothNeedIdeas = startUpIdeaRepository.findAllByLookingFor_Name("BOTH");
        List<InvestorInterested> shortlisted = (investorId != null) 
                ? investorInterestRepository.findAllByInvestorId(investorId) 
                : List.of();

        // Map shortlisted by startupIdeaId for fast lookup
        Map<Long, InvestorInterested> shortlistedMap = new HashMap<>();
        for (InvestorInterested ii : shortlisted) {
            if (ii.getStartUpIdea() != null && ii.getStartUpIdea().getId() != null) {
                shortlistedMap.put(ii.getStartUpIdea().getId(), ii);
            }
        }

        // Combine ideas with deduplication
        Map<Long, StartUpIdea> ideaMap = new HashMap<>();
        for (StartUpIdea idea : investorNeedIdeas) {
            if (idea.getId() != null) ideaMap.put(idea.getId(), idea);
        }
        for (StartUpIdea idea : bothNeedIdeas) {
            if (idea.getId() != null) ideaMap.put(idea.getId(), idea);
        }
        for (InvestorInterested ii : shortlisted) {
            if (ii.getStartUpIdea() != null && ii.getStartUpIdea().getId() != null) {
                ideaMap.put(ii.getStartUpIdea().getId(), ii.getStartUpIdea());
            }
        }

        // If no ideas found seeking INVESTOR yet, fall back to all ideas
        if (ideaMap.isEmpty()) {
            List<StartUpIdea> all = startUpIdeaRepository.findAll();
            for (StartUpIdea idea : all) {
                if (idea.getId() != null) ideaMap.put(idea.getId(), idea);
            }
        }

        List<DealPipelineItemDto> allDeals = new ArrayList<>();
        List<DealPipelineItemDto> screeningDeals = new ArrayList<>();
        List<DealPipelineItemDto> diligenceDeals = new ArrayList<>();
        List<DealPipelineItemDto> partnerMeetingDeals = new ArrayList<>();
        List<DealPipelineItemDto> termSheetDeals = new ArrayList<>();

        for (StartUpIdea idea : ideaMap.values()) {
            InvestorInterested interest = shortlistedMap.get(idea.getId());
            String rawStage = (interest != null && interest.getStage() != null) 
                    ? interest.getStage().trim().toUpperCase() 
                    : "SCREENING";

            if ("PASSED".equalsIgnoreCase(rawStage)) {
                // Deal was passed on by investor, skip from active pipeline boards
                continue;
            }

            DealPipelineItemDto dto = mapToPipelineDto(idea, interest, investorId);
            allDeals.add(dto);

            switch (dto.getStage()) {
                case "DILIGENCE":
                    diligenceDeals.add(dto);
                    break;
                case "PARTNER_MEETING":
                    partnerMeetingDeals.add(dto);
                    break;
                case "TERM_SHEET":
                    termSheetDeals.add(dto);
                    break;
                case "SCREENING":
                default:
                    screeningDeals.add(dto);
                    break;
            }
        }

        Map<String, List<DealPipelineItemDto>> dealsByStage = new HashMap<>();
        dealsByStage.put("screening", screeningDeals);
        dealsByStage.put("diligence", diligenceDeals);
        dealsByStage.put("partnerMeeting", partnerMeetingDeals);
        dealsByStage.put("termSheet", termSheetDeals);

        long activeInbound = screeningDeals.size();
        long inDiligence = diligenceDeals.size();
        long inPartnerMeeting = partnerMeetingDeals.size();
        long inTermSheet = termSheetDeals.size();
        long totalShortlisted = (investorId != null) ? investorInterestRepository.countByInvestorId(investorId) : 0L;

        List<Map<String, Object>> recentActivity = buildRecentActivity(allDeals);

        return new InvestorPipelineResponse(
                allDeals,
                dealsByStage,
                activeInbound,
                inDiligence,
                inPartnerMeeting,
                inTermSheet,
                totalShortlisted,
                recentActivity
        );
    }

    @Transactional
    public DealPipelineItemDto updateDealStage(Long investorId, Long ideaId, String rawStage, String notes) {
        if (investorId == null) {
            throw new IllegalArgumentException("Investor ID is required");
        }
        if (rawStage == null || rawStage.isBlank()) {
            throw new IllegalArgumentException("Stage is required");
        }

        String normalizedStage = normalizeStage(rawStage);

        StartUpIdea idea = startUpIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup idea not found with id: " + ideaId));

        InvestorInterested interest = investorInterestRepository
                .findByInvestorIdAndStartUpIdeaId(investorId, ideaId)
                .orElse(null);

        if (interest == null) {
            User investor = (userRepository != null) 
                    ? userRepository.findById(investorId).orElse(null) 
                    : null;
            if (investor == null) {
                throw new ResourceNotFoundException("Investor user not found with id: " + investorId);
            }
            interest = new InvestorInterested(investor, idea, normalizedStage);
            if (notes != null) {
                interest.setNotes(notes);
            }
            interest = investorInterestRepository.save(interest);
        } else {
            interest.setStage(normalizedStage);
            if (notes != null) {
                interest.setNotes(notes);
            }
            interest = investorInterestRepository.save(interest);
        }

        return mapToPipelineDto(idea, interest, investorId);
    }

    @Transactional
    public void passDeal(Long investorId, Long ideaId) {
        updateDealStage(investorId, ideaId, "PASSED", "Passed by investor");
    }

    @Transactional
    public boolean toggleInterest(Long investorId, Long ideaId) {
        if (investorId == null) {
            throw new IllegalArgumentException("Investor ID is required");
        }
        Optional<InvestorInterested> existing = investorInterestRepository.findByInvestorIdAndStartUpIdeaId(investorId, ideaId);
        if (existing.isPresent()) {
            investorInterestRepository.delete(existing.get());
            return false;
        } else {
            StartUpIdea idea = startUpIdeaRepository.findById(ideaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Startup idea not found: " + ideaId));
            User investor = (userRepository != null) ? userRepository.findById(investorId).orElse(null) : null;
            if (investor == null) {
                throw new ResourceNotFoundException("Investor not found: " + investorId);
            }
            InvestorInterested created = new InvestorInterested(investor, idea, "SCREENING");
            investorInterestRepository.save(created);
            return true;
        }
    }

    private DealPipelineItemDto mapToPipelineDto(StartUpIdea idea, InvestorInterested interest, Long investorId) {
        String stage = (interest != null && interest.getStage() != null)
                ? normalizeStage(interest.getStage())
                : "SCREENING";

        String stageClass = switch (stage) {
            case "DILIGENCE" -> "reviewing";
            case "PARTNER_MEETING" -> "reviewing";
            case "TERM_SHEET" -> "committed";
            default -> "new";
        };

        String startupTitle = (idea.getTitle() != null && !idea.getTitle().isBlank())
                ? idea.getTitle()
                : "Untitled Startup";

        String logo = generateInitials(startupTitle);

        String pitch = (idea.getDescription() != null && !idea.getDescription().isBlank())
                ? idea.getDescription()
                : ((idea.getProblem() != null && !idea.getProblem().isBlank()) ? idea.getProblem() : "Exciting innovation seeking partners and capital.");

        String industryName = (idea.getIndustry() != null && idea.getIndustry().getName() != null)
                ? idea.getIndustry().getName()
                : "Technology";

        String founderName = (idea.getUser() != null && idea.getUser().getName() != null)
                ? idea.getUser().getName()
                : "Founder";

        String founderEmail = (idea.getUser() != null && idea.getUser().getEmail() != null)
                ? idea.getUser().getEmail()
                : "";

        String founderInitials = generateInitials(founderName);

        String ask = (idea.getTargetMarket() != null && idea.getTargetMarket().startsWith("$"))
                ? idea.getTargetMarket()
                : "Seed • Growth";

        Long likeCount = (idea.getId() != null) ? likeRepository.countByStartupIdeaId(idea.getId()) : 0L;
        Long commentCount = (idea.getId() != null) ? commentRepository.countByStartupIdeaId(idea.getId()) : 0L;
        Boolean likedByCurrentUser = (investorId != null && idea.getId() != null) 
                && likeRepository.findByStartupIdeaIdAndUserId(idea.getId(), investorId).isPresent();

        return new DealPipelineItemDto(
                idea.getId(),
                interest != null ? interest.getId() : null,
                startupTitle,
                logo,
                pitch,
                idea.getProblem(),
                idea.getSolution(),
                idea.getTargetMarket(),
                industryName,
                stage,
                stageClass,
                ask,
                founderName,
                founderEmail,
                founderInitials,
                likeCount,
                commentCount,
                likedByCurrentUser,
                interest != null,
                interest != null ? interest.getNotes() : null,
                idea.getCreatedAt(),
                idea.getUpdatedAt()
        );
    }

    private String normalizeStage(String raw) {
        if (raw == null) return "SCREENING";
        String upper = raw.trim().toUpperCase();
        if (upper.contains("DILIGENCE")) return "DILIGENCE";
        if (upper.contains("PARTNER") || upper.contains("MEETING")) return "PARTNER_MEETING";
        if (upper.contains("TERM") || upper.contains("SHEET") || upper.contains("COMMITTED")) return "TERM_SHEET";
        if (upper.contains("PASS")) return "PASSED";
        return "SCREENING";
    }

    private String generateInitials(String text) {
        if (text == null || text.isBlank()) return "SC";
        String[] parts = text.trim().split("\\s+");
        if (parts.length >= 2) {
            String first = parts[0].substring(0, 1).toUpperCase();
            String second = parts[1].substring(0, 1).toUpperCase();
            return first + second;
        } else if (text.length() >= 2) {
            return text.substring(0, 2).toUpperCase();
        } else {
            return text.toUpperCase();
        }
    }

    private List<Map<String, Object>> buildRecentActivity(List<DealPipelineItemDto> deals) {
        List<Map<String, Object>> activity = new ArrayList<>();
        int count = 0;
        for (DealPipelineItemDto d : deals) {
            if (count >= 5) break;
            Map<String, Object> item = new HashMap<>();
            item.put("id", d.getId());
            item.put("startup", d.getStartup());
            item.put("founder", d.getFounderName());
            item.put("stage", d.getStage());
            item.put("avatar", d.getLogo());
            item.put("message", "Deal currently in " + d.getStage().toLowerCase().replace("_", " ") + " stage.");
            activity.add(item);
            count++;
        }
        return activity;
    }
}