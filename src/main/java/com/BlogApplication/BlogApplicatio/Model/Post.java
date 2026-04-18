package com.BlogApplication.BlogApplicatio.Model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Post {


    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 5000)
    private String content;
    private String author ;
    private String category;
    private String imageUrl;
    private int likes = 0;
    private int views = 0;

    @jakarta.persistence.OneToMany(mappedBy = "post", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Comment> comments;

    @org.hibernate.annotations.CreationTimestamp
    @jakarta.persistence.Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    private java.time.LocalDateTime updatedAt;
}
