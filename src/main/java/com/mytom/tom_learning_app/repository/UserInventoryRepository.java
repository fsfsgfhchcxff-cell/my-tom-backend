package com.mytom.tom_learning_app.repository;

import com.mytom.tom_learning_app.entity.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    List<UserInventory> findByUserId(Long userId);
    List<UserInventory> findByUserIdAndIsEquipped(Long userId, Boolean isEquipped);
    Optional<UserInventory> findByUserIdAndItemId(Long userId, Long itemId);
}
