package com.platform.SheConnect.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.InvestorInterestRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;

@ExtendWith(MockitoExtension.class)
class InvestorDashboardServiceTest {

    @Mock
    private StartUpIdeaRepository startUpIdeaRepository;
    
    @Mock
    private InvestorInterestRepository investorInterestRepository;
    
    @Mock
    private CommentRepository commentRepository;
    
    @Mock
    private LikeRepository likeRepository;
    
    @InjectMocks
    private InvestorDashboardService investorDashboardService;
    
    private StartUpIdea testIdea1;
    private StartUpIdea testIdea2;
    private Industry testIndustry;
    private User testUser;
    private EntrepreneurNeed testNeed;
    
    @BeforeEach
    void setUp() {
        // Create test data before each test
        testIndustry = new Industry();
        testIndustry.setId(1L);
        testIndustry.setName("Technology");
        
        testNeed = new EntrepreneurNeed();
        testNeed.setId(1L);
        testNeed.setName("INVESTOR");
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        
        testIdea1 = new StartUpIdea();
        testIdea1.setId(1L);
        testIdea1.setTitle("AI Farming App");
        testIdea1.setDescription("AI for farmers");
        testIdea1.setIndustry(testIndustry);
        
        testIdea2 = new StartUpIdea();
        testIdea2.setId(2L);
        testIdea2.setTitle("E-Learning Platform");
        testIdea2.setDescription("Online education");
        testIdea2.setIndustry(testIndustry);
    }
    
    @Test
    void getAllStartUpIdea_shouldReturnAllIdeas() {
        // Arrange
        List<StartUpIdea> expectedIdeas = Arrays.asList(testIdea1, testIdea2);
        when(startUpIdeaRepository.findAll()).thenReturn(expectedIdeas);
        
        // Act
        List<StartUpIdea> actualIdeas = investorDashboardService.getAllStartUpIdea();
        
        // Assert
        assertEquals(2, actualIdeas.size());
        assertEquals(expectedIdeas, actualIdeas);
        verify(startUpIdeaRepository, times(1)).findAll();
    }
    
    @Test
    void getAllStartUpIdea_whenNoIdeas_shouldReturnEmptyList() {
        // Arrange
        when(startUpIdeaRepository.findAll()).thenReturn(Arrays.asList());
        
        // Act
        List<StartUpIdea> actualIdeas = investorDashboardService.getAllStartUpIdea();
        
        // Assert
        assertTrue(actualIdeas.isEmpty());
        verify(startUpIdeaRepository, times(1)).findAll();
    }
    
    // @Test
    // void getIdeasByIndustry_shouldReturnIdeasMatchingIndustry() {
    //     // Arrange
    //     List<StartUpIdea> expectedIdeas = Arrays.asList(testIdea1, testIdea2);
    //     when(startUpIdeaRepository.findAllByIndustry(testIndustry)).thenReturn(expectedIdeas);
        
    //     // Act
    //     List<StartUpIdea> actualIdeas = investorDashboardService.getIdeasByIndustry(testIndustry);
        
    //     // Assert
    //     assertEquals(2, actualIdeas.size());
    //     verify(startUpIdeaRepository, times(1)).findAllByIndustry_(testIndustry);
    // }
    
    @Test
    void getInvestorInterestCount_shouldReturnCorrectCount() {
        // Arrange
        Long userId = 1L;
        long expectedCount = 5L;
        when(investorInterestRepository.countByInvestorId(userId)).thenReturn(expectedCount);
        
        // Act
        long actualCount = investorDashboardService.getInvestorInterestCount(userId);
        
        // Assert
        assertEquals(expectedCount, actualCount);
        verify(investorInterestRepository, times(1)).countByInvestorId(userId);
    }
    
    @Test
    void getInvestorInterestCount_whenNoInterests_shouldReturnZero() {
        // Arrange
        Long userId = 1L;
        when(investorInterestRepository.countByInvestorId(userId)).thenReturn(0L);
        
        // Act
        long actualCount = investorDashboardService.getInvestorInterestCount(userId);
        
        // Assert
        assertEquals(0, actualCount);
    }
    
    @Test
    void getTotalLikes_shouldReturnCorrectCount() {
        // Arrange
        Long userId = 1L;
        long expectedLikes = 10L;
        when(likeRepository.countByUserId(userId)).thenReturn(expectedLikes);
        
        // Act
        long actualLikes = investorDashboardService.getTotalLikes(userId);
        
        // Assert
        assertEquals(expectedLikes, actualLikes);
        verify(likeRepository, times(1)).countByUserId(userId);
    }
    
    @Test
    void getTotalComments_shouldReturnCorrectCount() {
        // Arrange
        Long userId = 1L;
        long expectedComments = 8L;
        when(commentRepository.countByUserId(userId)).thenReturn(expectedComments);
        
        // Act
        long actualComments = investorDashboardService.getTotalComments(userId);
        
        // Assert
        assertEquals(expectedComments, actualComments);
        verify(commentRepository, times(1)).countByUserId(userId);
    }
    
    @Test
    void getIdeasByEntrepreneurNeed_shouldReturnIdeasMatchingNeed() {
        // Arrange
        String needName = "INVESTOR";
        List<StartUpIdea> expectedIdeas = Arrays.asList(testIdea1);
        when(startUpIdeaRepository.findAllByLookingFor_Name(needName)).thenReturn(expectedIdeas);
        
        // Act
        List<StartUpIdea> actualIdeas = investorDashboardService.getIdeasByEntrepreneurNeed(needName);
        
        // Assert
        assertEquals(1, actualIdeas.size());
        verify(startUpIdeaRepository, times(1)).findAllByLookingFor_Name(needName);
    }
}