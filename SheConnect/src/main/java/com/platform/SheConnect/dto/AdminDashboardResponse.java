package com.platform.SheConnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Map<String, Object> stats;
    private List<AdminUserDto> users;
    private List<AdminIdeaDto> ideas;
    private List<AdminIndustryDto> industries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminUserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String title;
        private String location;
        private String createdAt;
        private Long ideasCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminIdeaDto {
        private Long id;
        private String title;
        private String description;
        private String problem;
        private String solution;
        private String targetMarket;
        private String industry;
        private List<String> lookingFor;
        private String founderName;
        private String founderEmail;
        private Long likesCount;
        private Long commentsCount;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminIndustryDto {
        private Long id;
        private String name;
        private Long startupCount;
    }
}
