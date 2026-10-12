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
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(InvestorDashboardService.class);

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
        try {
            // Safely fetch all startup ideas
            List<StartUpIdea> allIdeas = new ArrayList<>();
            try {
                allIdeas = startUpIdeaRepository.findAll();
            } catch (Exception e) {
                log.warn("Error calling startUpIdeaRepository.findAll(): {}", e.getMessage());
            }

            // Safely fetch shortlisted ideas for this investor
            List<InvestorInterested> shortlisted = List.of();
            if (investorId != null) {
                try {
                    shortlisted = investorInterestRepository.findAllByInvestorId(investorId);
                } catch (Exception e) {
                    log.warn("Error fetching shortlisted for investor {}: {}", investorId, e.getMessage());
                }
            }

            // Map shortlisted by startupIdeaId for fast lookup
            Map<Long, InvestorInterested> shortlistedMap = new HashMap<>();
            for (InvestorInterested ii : shortlisted) {
                try {
                    if (ii != null && ii.getStartUpIdea() != null && ii.getStartUpIdea().getId() != null) {
                        shortlistedMap.put(ii.getStartUpIdea().getId(), ii);
                    }
                } catch (Exception e) {
                    // ignore unresolvable proxy
                }
            }

            // Collect ideas: prefer ideas seeking INVESTOR or BOTH, or shortlisted, or all if none tagged
            Map<Long, StartUpIdea> ideaMap = new HashMap<>();
            for (StartUpIdea idea : allIdeas) {
                if (idea == null || idea.getId() == null) continue;
                boolean isShortlisted = shortlistedMap.containsKey(idea.getId());
                boolean isSeekingInvestor = false;
                try {
                    if (idea.getLookingFor() != null) {
                        for (com.platform.SheConnect.entity.EntrepreneurNeed need : idea.getLookingFor()) {
                            if (need != null && need.getName() != null) {
                                String n = need.getName().trim().toUpperCase();
                                if (n.contains("INVESTOR") || n.contains("BOTH")) {
                                    isSeekingInvestor = true;
                                    break;
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    // Ignore lazy load issues on lookingFor
                }

                if (isShortlisted || isSeekingInvestor) {
                    ideaMap.put(idea.getId(), idea);
                }
            }

            // If none matched filter, include all published ideas
            if (ideaMap.isEmpty()) {
                for (StartUpIdea idea : allIdeas) {
                    if (idea != null && idea.getId() != null) {
                        ideaMap.put(idea.getId(), idea);
                    }
                }
            }

            List<DealPipelineItemDto> allDeals = new ArrayList<>();
            List<DealPipelineItemDto> screeningDeals = new ArrayList<>();
            List<DealPipelineItemDto> diligenceDeals = new ArrayList<>();
            List<DealPipelineItemDto> partnerMeetingDeals = new ArrayList<>();
            List<DealPipelineItemDto> termSheetDeals = new ArrayList<>();

            for (StartUpIdea idea : ideaMap.values()) {
                InvestorInterested interest = shortlistedMap.get(idea.getId());
                String rawStage = "SCREENING";
                try {
                    if (interest != null && interest.getStage() != null) {
                        rawStage = interest.getStage().trim().toUpperCase();
                    }
                } catch (Exception e) {
                    rawStage = "SCREENING";
                }

                if ("PASSED".equalsIgnoreCase(rawStage)) {
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
            long totalShortlisted = 0L;
            if (investorId != null) {
                try {
                    totalShortlisted = investorInterestRepository.countByInvestorId(investorId);
                } catch (Exception e) {
                    totalShortlisted = shortlisted.size();
                }
            }

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
        } catch (Exception ex) {
            log.error("Error generating investor pipeline: ", ex);
            return new InvestorPipelineResponse(
                    List.of(),
                    Map.of("screening", List.of(), "diligence", List.of(), "partnerMeeting", List.of(), "termSheet", List.of()),
                    0L, 0L, 0L, 0L, 0L,
                    List.of()
            );
        }
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

        String industryName = "Technology";
        try {
            if (idea.getIndustry() != null && idea.getIndustry().getName() != null) {
                industryName = idea.getIndustry().getName();
            }
        } catch (Exception e) {
            industryName = "Technology";
        }

        String founderName = "Founder";
        String founderEmail = "";
        try {
            if (idea.getUser() != null) {
                if (idea.getUser().getName() != null) founderName = idea.getUser().getName();
                if (idea.getUser().getEmail() != null) founderEmail = idea.getUser().getEmail();
            }
        } catch (Exception e) {
            founderName = "Founder";
        }

        String founderInitials = generateInitials(founderName);

        String ask = "Seed • Growth";
        try {
            if (idea.getTargetMarket() != null && !idea.getTargetMarket().isBlank()) {
                ask = idea.getTargetMarket();
            }
        } catch (Exception e) {
            ask = "Seed • Growth";
        }

        Long likeCount = 0L;
        Long commentCount = 0L;
        Boolean likedByCurrentUser = false;
        try {
            if (idea.getId() != null) {
                likeCount = likeRepository.countByStartupIdeaId(idea.getId());
                commentCount = commentRepository.countByStartupIdeaId(idea.getId());
                if (investorId != null) {
                    likedByCurrentUser = likeRepository.findByStartupIdeaIdAndUserId(idea.getId(), investorId).isPresent();
                }
            }
        } catch (Exception e) {
            // ignore
        }

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