package com.mytom.tom_learning_app.service;

import com.mytom.tom_learning_app.entity.StudySession;
import com.mytom.tom_learning_app.entity.User;
import com.mytom.tom_learning_app.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class StudyService {
    
    private final StudySessionRepository sessionRepository;
    private final UserService userService;
    
    // 开始学习会话
    @Transactional
    public StudySession startStudySession(Long userId) {
        userService.getUser(userId); // 验证用户存在
        
        StudySession session = new StudySession();
        session.setUserId(userId);
        session.setStartTime(LocalDateTime.now());
        return sessionRepository.save(session);
    }
    
    // 结束学习会话
    @Transactional
    public StudySession endStudySession(Long sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("学习会话不存在"));
        
        if (session.getEndTime() != null) {
            throw new RuntimeException("该学习会话已经结束");
        }
        
        LocalDateTime endTime = LocalDateTime.now();
        session.setEndTime(endTime);
        
        // 计算学习时长（分钟）
        long minutes = ChronoUnit.MINUTES.between(session.getStartTime(), endTime);
        session.setDurationMinutes((int) minutes);
        
        // 计算奖励钻石：每10分钟奖励1钻石
        int diamonds = (int) (minutes / 10);
        session.setDiamondsEarned(diamonds);
        
        // 更新用户钻石和学习时长
        User user = userService.getUser(session.getUserId());
        user.setDiamondBalance(user.getDiamondBalance() + diamonds);
        user.setTotalStudyMinutes(user.getTotalStudyMinutes() + (int) minutes);
        userService.addDiamonds(session.getUserId(), diamonds);
        
        return sessionRepository.save(session);
    }
    
    // 获取用户的所有学习记录
    public List<StudySession> getUserStudySessions(Long userId) {
        return sessionRepository.findByUserId(userId);
    }
}

