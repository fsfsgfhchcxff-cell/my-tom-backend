package com.mytom.tom_learning_app.config;

import com.mytom.tom_learning_app.entity.Item;
import com.mytom.tom_learning_app.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ItemRepository itemRepository;
    
    @Override
    public void run(String... args) {
        // 清空现有数据
        itemRepository.deleteAll();
        
        // 添加食物
        createItem(Item.ItemType.FOOD, "🍕 披萨", 5, "food_pizza.png", "美味的意大利披萨");
        createItem(Item.ItemType.FOOD, "🍔 汉堡", 5, "food_burger.png", "多汁的牛肉汉堡");
        createItem(Item.ItemType.FOOD, "🍦 冰淇淋", 3, "food_icecream.png", "清凉的冰淇淋");
        createItem(Item.ItemType.FOOD, "🍰 蛋糕", 8, "food_cake.png", "甜蜜的草莓蛋糕");
        createItem(Item.ItemType.FOOD, "🥤 可乐", 2, "food_cola.png", "冰镇可乐");
        createItem(Item.ItemType.FOOD, "🍎 苹果", 2, "food_apple.png", "新鲜的红苹果");
        
        // 添加衣服
        createItem(Item.ItemType.CLOTH, "👕 T恤", 15, "cloth_tshirt.png", "舒适的棉质T恤");
        createItem(Item.ItemType.CLOTH, "👔 西装", 50, "cloth_suit.png", "帅气的西装套装");
        createItem(Item.ItemType.CLOTH, "👗 连衣裙", 30, "cloth_dress.png", "优雅的连衣裙");
        createItem(Item.ItemType.CLOTH, "🧥 外套", 40, "cloth_jacket.png", "时尚的外套");
        createItem(Item.ItemType.CLOTH, "🎩 帽子", 10, "cloth_hat.png", "可爱的帽子");
        createItem(Item.ItemType.CLOTH, "👟 运动鞋", 25, "cloth_shoes.png", "舒适的运动鞋");
        
        // 添加家具
        createItem(Item.ItemType.FURNITURE, "🛏️ 豪华床", 100, "furniture_bed.png", "舒适的双人床");
        createItem(Item.ItemType.FURNITURE, "🪑 沙发", 80, "furniture_sofa.png", "柔软的沙发");
        createItem(Item.ItemType.FURNITURE, "📺 电视", 120, "furniture_tv.png", "55寸智能电视");
        createItem(Item.ItemType.FURNITURE, "💡 落地灯", 30, "furniture_lamp.png", "温馨的落地灯");
        createItem(Item.ItemType.FURNITURE, "🖼️ 壁画", 40, "furniture_painting.png", "精美的装饰画");
        createItem(Item.ItemType.FURNITURE, "🌿 盆栽", 20, "furniture_plant.png", "绿色的观叶植物");
        createItem(Item.ItemType.FURNITURE, "📚 书架", 60, "furniture_bookshelf.png", "实木书架");
        createItem(Item.ItemType.FURNITURE, "🕰️ 时钟", 35, "furniture_clock.png", "复古挂钟");
        
        System.out.println("数据初始化完成！");
    }
    
    private void createItem(Item.ItemType type, String name, Integer price, 
                           String imageUrl, String description) {
        Item item = new Item();
        item.setType(type);
        item.setName(name);
        item.setPrice(price);
        item.setImageUrl(imageUrl);
        item.setDescription(description);
        itemRepository.save(item);
    }
}

