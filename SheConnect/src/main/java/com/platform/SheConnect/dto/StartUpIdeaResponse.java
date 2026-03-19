package com.platform.SheConnect.dto;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.dto.LoginResponse;


public class StartUpIdeaResponse {
    private Long id;
    private String title;
    private String industry;
    private List<String> lookingFor;
    private LoginResponse ideaAdmin;
    // add like COUNT and COMMENT  AND ALSO COMMENT COUNT
    private Long likeCount;
    private Long commentCount;
    private Boolean likedByCurrentUser;
    private Comment comment;
    private LoginResponse user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public StartUpIdeaResponse(Long id, User ideaAdmin, String title, String industry, List<String> lookingFor, LocalDateTime updatedAt, LocalDateTime createdAt, User user, Long likeCount, Long commentCount, Boolean likedByCurrentUser, Comment comment) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.lookingFor = lookingFor;
        this.ideaAdmin = mapToLoginResponse(ideaAdmin);
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.user = mapToLoginResponse(user);
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.comment = comment;
    }
    public LoginResponse mapToLoginResponse(User user) {
        if (user == null) {
            return null;
        }
        return new LoginResponse(user.getName(), user.getEmail(), user.getRole().getName(), null, null);
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }
    public Long getLikeCount() {
        return likeCount;
    }   
    public Long getCommentCount() {
        return commentCount;
    }
    public Boolean getLikedByCurrentUser() {
        return likedByCurrentUser;
    }
    public Comment getComment() {
        return comment;
    }

    public Long getId() {
        return id;
    }
    public LoginResponse getUser(){
        return user;
    }
    public LoginResponse getIdeaAdmin(){
        return ideaAdmin;
    }

    public String getTitle() {
        return title;
    }

    public String getIndustry() {
        return industry;
    }

    public List<String> getLookingFor() {
        return lookingFor;
    }
}
