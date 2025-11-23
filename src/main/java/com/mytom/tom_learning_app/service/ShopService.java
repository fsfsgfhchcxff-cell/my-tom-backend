package com.mytom.tom_learning_app.service;

import com.mytom.tom_learning_app.entity.Item;
import com.mytom.tom_learning_app.entity.User;
import com.mytom.tom_learning_app.entity.UserInventory;
import com.mytom.tom_learning_app.repository.UserInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShopService {
    
    private final UserService userService;
    private final ItemService itemService;
    private final UserInventoryRepository inventoryRepository;
    
    // 购买商品
    @Transactional
    public UserInventory purchaseItem(Long userId, Long itemId) {
        User user = userService.getUser(userId);
        Item item = itemService.getItem(itemId);
        
        // 检查钻石是否足够
        if (user.getDiamondBalance() < item.getPrice()) {
            throw new RuntimeException("钻石不足，无法购买");
        }
        
        // 检查是否已拥有该物品（食物除外，食物可以多次购买）
        Optional<UserInventory> existing = inventoryRepository.findByUserIdAndItemId(userId, itemId);
        if (existing.isPresent() && item.getType() != Item.ItemType.FOOD) {
            throw new RuntimeException("已经拥有该物品");
        }
        
        // 扣除钻石
        userService.deductDiamonds(userId, item.getPrice());
        
        // 添加到背包
        if (existing.isPresent() && item.getType() == Item.ItemType.FOOD) {
            // 食物类型，增加数量
            UserInventory inventory = existing.get();
            inventory.setQuantity(inventory.getQuantity() + 1);
            return inventoryRepository.save(inventory);
        } else {
            // 新物品
            UserInventory inventory = new UserInventory();
            inventory.setUserId(userId);
            inventory.setItemId(itemId);
            inventory.setIsEquipped(false);
            return inventoryRepository.save(inventory);
        }
    }
    
    // 获取用户背包
    public List<UserInventory> getUserInventory(Long userId) {
        return inventoryRepository.findByUserId(userId);
    }
    
    // 装备/使用物品
    @Transactional
    public UserInventory equipItem(Long userId, Long inventoryId) {
        UserInventory inventory = inventoryRepository.findById(inventoryId)
            .orElseThrow(() -> new RuntimeException("背包物品不存在"));
        
        if (!inventory.getUserId().equals(userId)) {
            throw new RuntimeException("这不是你的物品");
        }
        
        // 获取物品类型
        Item item = itemService.getItem(inventory.getItemId());
        
        // 如果是食物，使用后数量减1
        if (item.getType() == Item.ItemType.FOOD) {
            if (inventory.getQuantity() <= 0) {
                throw new RuntimeException("食物已用完");
            }
            inventory.setQuantity(inventory.getQuantity() - 1);
            if (inventory.getQuantity() == 0) {
                inventoryRepository.delete(inventory);
                return inventory;
            }
            return inventoryRepository.save(inventory);
        }
        
        // 如果是衣服或家具，先取消同类型的其他装备
        if (item.getType() == Item.ItemType.CLOTH || item.getType() == Item.ItemType.FURNITURE) {
            List<UserInventory> equipped = inventoryRepository.findByUserIdAndIsEquipped(userId, true);
            for (UserInventory eq : equipped) {
                Item equippedItem = itemService.getItem(eq.getItemId());
                if (equippedItem.getType() == item.getType()) {
                    eq.setIsEquipped(false);
                    inventoryRepository.save(eq);
                }
            }
        }
        
        inventory.setIsEquipped(!inventory.getIsEquipped());
        return inventoryRepository.save(inventory);
    }
}

