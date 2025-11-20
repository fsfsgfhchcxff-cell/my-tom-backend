package com.mytom.tom_learning_app.controller;

import com.mytom.tom_learning_app.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 游戏主控制器
 * 处理用户首页数据和钻石相关操作
 */
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {
    
    private final GameService gameService;
    
    /**
     * 获取用户首页数据
     * 如果用户不存在，会自动创建并返回初始100钻石
     * 
     * @param userId 用户ID
     * @return 用户数据，包含钻石余额等信息
     */
    @GetMapping("/home/{userId}")
    public ResponseEntity<Map<String, Object>> getHomeData(@PathVariable Long userId) {
        try {
            Map<String, Object> homeData = gameService.getHomeData(userId);
            return ResponseEntity.ok(homeData);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * 增加用户钻石
     * 
     * @param userId 用户ID
     * @param request 包含amount字段的请求体
     * @return 更新后的用户数据
     */
    @PostMapping("/diamonds/{userId}/add")
    public ResponseEntity<Map<String, Object>> addDiamonds(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer amount = request.get("amount");
            if (amount == null || amount <= 0) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "钻石数量必须大于0"));
            }
            
            Map<String, Object> result = gameService.addDiamonds(userId, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * 测试接口 - 用于快速验证服务是否正常
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "游戏服务运行正常！🎮"
        ));
    }
}

