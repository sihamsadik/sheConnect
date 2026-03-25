package com.platform.SheConnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequestDto {
    @NotBlank(message = "comment can not be blank")
    @Size(max = 1000, message = "comment can not exceed 1000 characters")
    private String content;
   

    public CommentRequestDto(String content) {
        this.content = content;
    
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
