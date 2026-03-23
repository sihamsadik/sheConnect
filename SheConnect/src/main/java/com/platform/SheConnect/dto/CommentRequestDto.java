package com.platform.SheConnect.dto;

public class CommentRequestDto {
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
