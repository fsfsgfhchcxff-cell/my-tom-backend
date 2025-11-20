package com.mytom.tom_learning_app.controller;

import com.mytom.tom_learning_app.entity.Item;
import com.mytom.tom_learning_app.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemController {
    
    private final ItemService itemService;
    
    // 获取所有商品
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }
    
    // 根据类型获取商品
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Item>> getItemsByType(@PathVariable Item.ItemType type) {
        return ResponseEntity.ok(itemService.getItemsByType(type));
    }
    
    // 获取单个商品
    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItem(itemId));
    }
}

