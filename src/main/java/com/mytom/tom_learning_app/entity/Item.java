package com.mytom.tom_learning_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "items")
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer price;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    private String description;
    
    public enum ItemType {
        FOOD,      // 零食
        CLOTH,     // 衣服
        FURNITURE  // 家具
    }
}

