package com.mytom.tom_learning_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(name = "diamond_balance")
    private Integer diamondBalance = 0;
    
    @Column(name = "last_check_in")
    private LocalDate lastCheckIn;
    
    @Column(name = "total_study_minutes")
    private Integer totalStudyMinutes = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

