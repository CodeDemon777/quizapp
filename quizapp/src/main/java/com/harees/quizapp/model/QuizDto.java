package com.harees.quizapp.model;

import lombok.Data;

@Data
public class QuizDto {
    private Integer id;
    private String title;
    private Integer questionCount;
    private String category;

    public QuizDto() {
    }

    public QuizDto(Integer id, String title, Integer questionCount, String category) {
        this.id = id;
        this.title = title;
        this.questionCount = questionCount;
        this.category = category;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
