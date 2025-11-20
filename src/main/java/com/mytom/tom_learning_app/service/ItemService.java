package com.mytom.tom_learning_app.service;

import com.mytom.tom_learning_app.entity.Item;
import com.mytom.tom_learning_app.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ItemService {
    
    private final ItemRepository itemRepository;
    
    // 获取所有商品
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
    // 根据类型获取商品
    public List<Item> getItemsByType(Item.ItemType type) {
        return itemRepository.findByType(type);
    }
    
    // 获取单个商品
    public Item getItem(Long itemId) {
        return itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("商品不存在"));
    }
}

