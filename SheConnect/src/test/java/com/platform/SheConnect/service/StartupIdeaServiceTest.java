// package com.platform.SheConnect.service;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// import java.util.Arrays;
// import java.util.HashSet;
// import java.util.List;
// import java.util.Optional;
// import java.util.Set;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
// import com.platform.SheConnect.entity.EntrepreneurNeed;
// import com.platform.SheConnect.entity.Industry;
// import com.platform.SheConnect.entity.StartUpIdea;
// import com.platform.SheConnect.entity.User;
// import com.platform.SheConnect.exception.ResourceNotFoundException;
// import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
// import com.platform.SheConnect.repository.IndustryRepository;
// import com.platform.SheConnect.repository.StartUpIdeaRepository;

// @ExtendWith(MockitoExtension.class)
// class StartUpIdeaServiceTest {

//     @Mock
//     private StartUpIdeaRepository startUpIdeaRepository;
    
//     @Mock
//     private IndustryRepository industryRepository;
    
//     @Mock
//     private EntrepreneurNeedRepository entrepreneurNeedRepository;
    
//     @InjectMocks
//     private StartUpIdeaService startUpIdeaService;
    
//     private User testUser;
//     private Industry testIndustry;
//     private EntrepreneurNeed investorNeed;
//     private EntrepreneurNeed advisorNeed;
//     private CreateStartUpIdeaRequest validRequest;
    
//     @BeforeEach
//     void setUp() {
//         // Create test user
//         testUser = new User();
//         testUser.setId(1L);
//         testUser.setEmail("test@example.com");
//         testUser.setName("Test User");
        
//         // Create test industry
//         testIndustry = new Industry();
//         testIndustry.setId(1L);
//         testIndustry.setName("Technology");
        
//         // Create test entrepreneur needs
//         investorNeed = new EntrepreneurNeed();
//         investorNeed.setId(1L);
//         investorNeed.setName("INVESTOR");
        
//         advisorNeed = new EntrepreneurNeed();
//         advisorNeed.setId(2L);
//         advisorNeed.setName("ADVISOR");
        
//         // Create valid request
//         validRequest = new CreateStartUpIdeaRequest();
//         validRequest.setTitle("AI Farming Assistant");
//         validRequest.setDescription("An AI-powered app for farmers");
//         validRequest.setProblem("Farmers lack real-time crop advice");
//         validRequest.setSolution("AI chatbot that analyzes crops and gives advice");
//         validRequest.setTargetMarket("Small-scale farmers in Africa");
//         validRequest.setIndustryName("Technology");
//         validRequest.setLookingFor(Arrays.asList("INVESTOR"));
//     }
    
//     // ==================== CREATE METHOD TESTS ====================
    
//     @Test
//     void create_shouldSaveNewStartupIdea_whenAllDataValid() {
//         // Arrange
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(entrepreneurNeedRepository.findByName("INVESTOR")).thenReturn(Optional.of(investorNeed));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         });
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertNotNull(result);
//         assertEquals("AI Farming Assistant", result.getTitle());
//         assertEquals("An AI-powered app for farmers", result.getDescription());
//         assertEquals(testIndustry, result.getIndustry());
//         assertEquals(testUser, result.getUser());
//         assertNotNull(result.getLookingFor());
//         assertTrue(result.getLookingFor().contains(investorNeed));
        
//         verify(industryRepository, times(1)).findByName("Technology");
//         verify(entrepreneurNeedRepository, times(1)).findByName("INVESTOR");
//         verify(startUpIdeaRepository, times(1)).save(any(StartUpIdea.class));
//     }
    
//     @Test
//     void create_shouldSaveWithMultipleNeeds_whenLookingForHasMultipleValues() {
//         // Arrange
//         validRequest.setLookingFor(Arrays.asList("INVESTOR", "ADVISOR"));
        
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(entrepreneurNeedRepository.findByName("INVESTOR")).thenReturn(Optional.of(investorNeed));
//         when(entrepreneurNeedRepository.findByName("ADVISOR")).thenReturn(Optional.of(advisorNeed));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         });
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertNotNull(result);
//         assertEquals(2, result.getLookingFor().size());
//         assertTrue(result.getLookingFor().contains(investorNeed));
//         assertTrue(result.getLookingFor().contains(advisorNeed));
        
//         verify(entrepreneurNeedRepository, times(1)).findByName("INVESTOR");
//         verify(entrepreneurNeedRepository, times(1)).findByName("ADVISOR");
//     }
    
//     @Test
//     void create_shouldThrowException_whenUserIsNull() {
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(null, validRequest);
//         });
        
//         assertEquals("User required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenRequestIsNull() {
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, null);
//         });
        
//         assertEquals("Request required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenTitleIsBlank() {
//         // Arrange
//         validRequest.setTitle("");
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenTitleIsNull() {
//         // Arrange
//         validRequest.setTitle(null);
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenProblemIsBlank() {
//         // Arrange
//         validRequest.setProblem("");
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenSolutionIsBlank() {
//         // Arrange
//         validRequest.setSolution("");
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenTargetMarketIsBlank() {
//         // Arrange
//         validRequest.setTargetMarket("");
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowException_whenIndustryNameIsBlank() {
//         // Arrange
//         validRequest.setIndustryName("");
        
//         // Act & Assert
//         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertEquals("title, problem, solution, targetMarket, industryName are required", exception.getMessage());
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowResourceNotFoundException_whenIndustryNotFound() {
//         // Arrange
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.empty());
        
//         // Act & Assert
//         ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertTrue(exception.getMessage().contains("industry not found"));
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldThrowResourceNotFoundException_whenEntrepreneurNeedNotFound() {
//         // Arrange
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(entrepreneurNeedRepository.findByName("INVESTOR")).thenReturn(Optional.empty());
        
//         // Act & Assert
//         ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
//             startUpIdeaService.create(testUser, validRequest);
//         });
        
//         assertTrue(exception.getMessage().contains("enterprenuer need not found"));
//         verify(startUpIdeaRepository, never()).save(any());
//     }
    
//     @Test
//     void create_shouldTrimWhitespaceFromAllFields() {
//         // Arrange
//         validRequest.setTitle("  AI Farming Assistant  ");
//         validRequest.setProblem("  Farmers lack advice  ");
//         validRequest.setSolution("  AI chatbot  ");
//         validRequest.setTargetMarket("  Farmers  ");
//         validRequest.setIndustryName("  Technology  ");
        
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(entrepreneurNeedRepository.findByName("INVESTOR")).thenReturn(Optional.of(investorNeed));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         });
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertEquals("AI Farming Assistant", result.getTitle());
//         assertEquals("Farmers lack advice", result.getProblem());
//         assertEquals("AI chatbot", result.getSolution());
//         assertEquals("Farmers", result.getTargetMarket());
//     }
    
//     @Test
//     void create_shouldHandleNullLookingFor() {
//         // Arrange
//         validRequest.setLookingFor(null);
        
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         });
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertNotNull(result);
//         assertTrue(result.getLookingFor().isEmpty());
//     }
    
//     @Test
//     void create_shouldHandleEmptyLookingFor() {
//         // Arrange
//         validRequest.setLookingFor(Arrays.asList());
        
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         // });a
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertNotNull(result);
//         assertTrue(result.getLookingFor().isEmpty());
//     }



//     @Test
//     void create_shouldSkipBlankNeedsInLookingFor() {
//         // Arrange
//         validRequest.setLookingFor(Arrays.asList("INVESTOR", "", "  ", "ADVISOR"));
        
//         when(industryRepository.findByName("Technology")).thenReturn(Optional.of(testIndustry));
//         when(entrepreneurNeedRepository.findByName("INVESTOR")).thenReturn(Optional.of(investorNeed));
//         when(entrepreneurNeedRepository.findByName("ADVISOR")).thenReturn(Optional.of(advisorNeed));
//         when(startUpIdeaRepository.save(any(StartUpIdea.class))).thenAnswer(invocation -> {
//             StartUpIdea savedIdea = invocation.getArgument(0);
//             savedIdea.setId(1L);
//             return savedIdea;
//         });
        
//         // Act
//         StartUpIdea result = startUpIdeaService.create(testUser, validRequest);
        
//         // Assert
//         assertEquals(2, result.getLookingFor().size());
//         assertTrue(result.getLookingFor().contains(investorNeed));
//         assertTrue(result.getLookingFor().contains(advisorNeed));
//     }
    
//     // ==================== GET STARTUP IDEA BY ID TESTS ====================
    
//     @Test
//     void getStartUpIdeasById_shouldReturnIdea_whenIdExists() {
//         // Arrange
//         StartUpIdea expectedIdea = new StartUpIdea();
//         expectedIdea.setId(1L);
//         expectedIdea.setTitle("Test Idea");
//         expectedIdea.setDescription("Test Description");
        
//         when(startUpIdeaRepository.findById(1L)).thenReturn(Optional.of(expectedIdea));
        
//         // Act
//         StartUpIdea result = startUpIdeaService.getStartUpIdeasById(1L);
        
//         // Assert
//         assertNotNull(result);
//         assertEquals(1L, result.getId());
//         assertEquals("Test Idea", result.getTitle());
//         verify(startUpIdeaRepository, times(1)).findById(1L);
//     }
    
//     @Test
//     void getStartUpIdeasById_shouldThrowResourceNotFoundException_whenIdDoesNotExist() {
//         // Arrange
//         when(startUpIdeaRepository.findById(999L)).thenReturn(Optional.empty());
        
//         // Act & Assert
//         ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
//             startUpIdeaService.getStartUpIdeasById(999L);
//         });
        
//         assertTrue(exception.getMessage().contains("idea not found"));
//         verify(startUpIdeaRepository, times(1)).findById(999L);
//     }
    
//     // ==================== MY IDEAS TESTS ====================
    
//     @Test
//     void MyIdeas_shouldReturnListOfUserIdeas() {
//         // Arrange
//         StartUpIdea idea1 = new StartUpIdea();
//         idea1.setId(1L);
//         idea1.setTitle("Idea 1");
        
//         StartUpIdea idea2 = new StartUpIdea();
//         idea2.setId(2L);
//         idea2.setTitle("Idea 2");
        
//         List<StartUpIdea> expectedIdeas = Arrays.asList(idea1, idea2);
        
//         when(startUpIdeaRepository.findAllByUser(testUser)).thenReturn(expectedIdeas);
        
//         // Act
//         List<StartUpIdea> result = startUpIdeaService.MyIdeas(testUser);
        
//         // Assert
//         assertNotNull(result);
//         assertEquals(2, result.size());
//         assertEquals("Idea 1", result.get(0).getTitle());
//         assertEquals("Idea 2", result.get(1).getTitle());
//         verify(startUpIdeaRepository, times(1)).findAllByUser(testUser);
//     }
    
//     @Test
//     void MyIdeas_shouldReturnEmptyList_whenUserHasNoIdeas() {
//         // Arrange
//         when(startUpIdeaRepository.findAllByUser(testUser)).thenReturn(Arrays.asList());
        
//         // Act
//         List<StartUpIdea> result = startUpIdeaService.MyIdeas(testUser);
        
//         // Assert
//         assertNotNull(result);
//         assertTrue(result.isEmpty());
//         verify(startUpIdeaRepository, times(1)).findAllByUser(testUser);
//     }
// }