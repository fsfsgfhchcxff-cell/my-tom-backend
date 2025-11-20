package com.mytom.tom_learning_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "user_inventory")
public class UserInventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "item_id", nullable = false)
    private Long itemId;
    
    @Column(name = "is_equipped")
    private Boolean isEquipped = false;
    
    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt = LocalDateTime.now();
    
    // 对于食物类型，记录数量
    @Column(name = "quantity")
    private Integer quantity = 1;
}

