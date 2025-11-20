import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Trophy, Clock } from 'lucide-react';
import { getApiUrl } from '../config/api';

function StudyTimer({ userId }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(25);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedDiamonds, setEarnedDiamonds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes, seconds]);

  const handleStart = async () => {
    if (!isRunning && !sessionId) {
      try {
        const response = await fetch(getApiUrl('/api/study/start'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        if (response.ok) {
          const result = await response.json();
          setSessionId(result.session.id);
          setIsRunning(true);
        } else {
          alert('开始学习失败~ 请重试 (｡•́︿•̀｡)');
        }
      } catch (error) {
        console.error('开始学习失败:', error);
        alert('开始学习失败~ 请重试 (｡•́︿•̀｡)');
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleComplete = async () => {
    setIsRunning(false);
    
    if (sessionId) {
      try {
        const response = await fetch(getApiUrl(`/api/study/end/${sessionId}`), {
          method: 'POST'
        });

        if (response.ok) {
          const result = await response.json();
          setEarnedDiamonds(result.session.diamondsEarned);
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
            handleReset();
          }, 5000);
        }
      } catch (error) {
        console.error('结束学习失败:', error);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(totalMinutes);
    setSeconds(0);
    setSessionId(null);
  };

  const handleTimeChange = (newMinutes) => {
    if (!isRunning) {
      setTotalMinutes(newMinutes);
      setMinutes(newMinutes);
      setSeconds(0);
    }
  };

  // 计算进度百分比
  const totalSeconds = totalMinutes * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 标题卡片 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-100 p-6 mb-6 text-center">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
          <Clock size={32} className="text-purple-500" />
          专注学习时间
        </h2>
        <p className="text-gray-500 font-semibold">每学习10分钟获得1钻石~ 💎</p>
      </div>

      {/* 计时器主体 - 超大可爱圆形 */}
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 p-10 mb-6 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#FFB6D9" strokeWidth="40" />
          </svg>
        </div>

        {/* 进度圆环 */}
        <div className="relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* 背景圆环 */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#FFE5F1"
              strokeWidth="20"
            />
            {/* 进度圆环 */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 85}`}
              strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>
            </defs>
          </svg>

          {/* 中心时间显示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-extrabold text-gray-800 mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 font-semibold">
              {isRunning ? '🔥 专注中...' : '⏸️ 已暂停'}
            </div>
          </div>
        </div>
      </div>

      {/* 时间选择 */}
      {!isRunning && !sessionId && (
        <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="text-blue-500" size={20} />
            选择学习时长
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[10, 15, 25, 30].map((time) => (
              <button
                key={time}
                onClick={() => handleTimeChange(time)}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  totalMinutes === time
                    ? 'bg-gradient-to-b from-blue-400 to-blue-500 text-white border-b-4 border-blue-600 shadow-lg scale-110'
                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:scale-105'
                }`}
              >
                {time}分
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-gradient-to-b from-green-400 to-green-500 text-white px-8 py-5 rounded-2xl border-b-4 border-green-600 active:border-b-0 active:translate-y-1 transition-all font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 hover:from-green-500 hover:to-green-600"
          >
            <Play size={28} fill="currentColor" />
            {sessionId ? '继续学习' : '开始学习'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 bg-gradient-to-b from-yellow-400 to-yellow-500 text-white px-8 py-5 rounded-2xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 hover:from-yellow-500 hover:to-yellow-600"
          >
            <Pause size={28} fill="currentColor" />
            暂停
          </button>
        )}

        {sessionId && (
          <button
            onClick={handleReset}
            className="bg-gradient-to-b from-gray-400 to-gray-500 text-white px-6 py-5 rounded-2xl border-b-4 border-gray-600 active:border-b-0 active:translate-y-1 transition-all font-bold shadow-xl hover:from-gray-500 hover:to-gray-600"
          >
            <RotateCcw size={24} />
          </button>
        )}
      </div>

      {/* 学习完成庆祝弹窗 */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-sm mx-4 text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h3 className="text-3xl font-extrabold text-gray-800 mb-3">学习完成！</h3>
            <p className="text-gray-600 mb-6 font-semibold">恭喜你获得了</p>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-yellow-300 mb-6">
              <div className="text-6xl font-extrabold text-yellow-600 flex items-center justify-center gap-3">
                <Trophy size={48} fill="currentColor" />
                +{earnedDiamonds}
                <span className="text-4xl">💎</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-semibold">继续加油哦~ ✨</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyTimer;

