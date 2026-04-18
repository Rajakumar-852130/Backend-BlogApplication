package com.BlogApplication.BlogApplicatio.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String content;
    private String commenterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;

    @org.hibernate.annotations.CreationTimestamp
    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;
}
