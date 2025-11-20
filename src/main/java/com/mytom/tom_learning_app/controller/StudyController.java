package com.mytom.tom_learning_app.controller;

import com.mytom.tom_learning_app.entity.StudySession;
import com.mytom.tom_learning_app.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudyController {
    
    private final StudyService studyService;
    
    // 开始学习
    @PostMapping("/start")
    public ResponseEntity<?> startStudy(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            StudySession session = studyService.startStudySession(userId);
            return ResponseEntity.ok(Map.of(
                "message", "开始学习！加油！",
                "session", session
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 结束学习
    @PostMapping("/end/{sessionId}")
    public ResponseEntity<?> endStudy(@PathVariable Long sessionId) {
        try {
            StudySession session = studyService.endStudySession(sessionId);
            return ResponseEntity.ok(Map.of(
                "message", String.format("学习完成！用时%d分钟，获得%d钻石", 
                    session.getDurationMinutes(), session.getDiamondsEarned()),
                "session", session
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 获取用户学习记录
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<StudySession>> getStudyHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(studyService.getUserStudySessions(userId));
    }
}

