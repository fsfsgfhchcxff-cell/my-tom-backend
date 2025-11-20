package com.mytom.tom_learning_app.controller;

import com.mytom.tom_learning_app.entity.UserInventory;
import com.mytom.tom_learning_app.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShopController {
    
    private final ShopService shopService;
    
    // 购买商品
    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long itemId = request.get("itemId");
            UserInventory inventory = shopService.purchaseItem(userId, itemId);
            return ResponseEntity.ok(Map.of(
                "message", "购买成功！",
                "inventory", inventory
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 获取用户背包
    @GetMapping("/inventory/{userId}")
    public ResponseEntity<List<UserInventory>> getUserInventory(@PathVariable Long userId) {
        return ResponseEntity.ok(shopService.getUserInventory(userId));
    }
    
    // 装备/使用物品
    @PostMapping("/equip")
    public ResponseEntity<?> equipItem(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long inventoryId = request.get("inventoryId");
            UserInventory inventory = shopService.equipItem(userId, inventoryId);
            return ResponseEntity.ok(Map.of(
                "message", "操作成功！",
                "inventory", inventory
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

