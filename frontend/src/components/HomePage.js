import React, { useState, useEffect } from 'react';
import { Gem, Calendar, Clock, TrendingUp, Sparkles, Gift } from 'lucide-react';
import { getApiUrl } from '../config/api';

function HomePage({ userId, username }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckInEffect, setShowCheckInEffect] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/game/home/${userId}`));
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/users/${userId}/checkin`), {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(result.user);
        setShowCheckInEffect(true);
        setTimeout(() => setShowCheckInEffect(false), 3000);
      } else {
        const error = await response.json();
        alert(error.error || '签到失败啦~ 💔');
      }
    } catch (error) {
      console.error('签到失败:', error);
      alert('签到失败，请重试~ (｡•́︿•̀｡)');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-6xl animate-bounce">🐱</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 顶部状态栏 - 超可爱卡片 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-pink-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-purple-400 rounded-full p-3 border-4 border-white shadow-md">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">{username}</h2>
              <p className="text-sm text-gray-500 font-semibold">学习小能手~ ✨</p>
            </div>
          </div>
          <button
            onClick={handleCheckIn}
            className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-white px-5 py-2 rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all font-bold shadow-lg flex items-center gap-2 hover:from-yellow-500 hover:to-yellow-600"
          >
            <Calendar size={18} />
            签到
          </button>
        </div>

        {/* 钻石显示 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-3 shadow-md">
                <Gem className="text-purple-500" size={28} fill="currentColor" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">钻石余额</p>
                <p className="text-3xl font-extrabold text-purple-600">{userData?.diamonds || 0}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">总学习时长</p>
              <p className="text-xl font-bold text-pink-500">{userData?.totalStudyMinutes || 0} 分钟</p>
            </div>
          </div>
        </div>
      </div>

      {/* 汤姆猫展示区 - 超大可爱卡片 */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-pink-200 p-8 mb-6 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

        <div className="relative z-10 text-center">
          <h3 className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" fill="currentColor" />
            我的汤姆猫
            <Sparkles className="text-yellow-400" fill="currentColor" />
          </h3>

          {/* 猫咪主体 */}
          <div className="relative inline-block">
            <div className="text-9xl animate-float mb-4">
              🐱
            </div>
            {/* 装备显示位置 - 这里可以根据用户的装备动态显示 */}
          </div>

          <div className="mt-4 space-y-2">
            <div className="bg-pink-50 rounded-xl p-3 border-2 border-pink-200">
              <p className="text-sm text-gray-600 font-semibold">
                <span className="text-pink-500">❤️</span> 饱食度: 满满的~
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
              <p className="text-sm text-gray-600 font-semibold">
                <span className="text-purple-500">✨</span> 心情: 超开心!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 快速功能入口 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <QuickActionCard
          icon={<Clock size={32} />}
          title="开始学习"
          subtitle="赚取钻石"
          color="blue"
          gradient="from-blue-400 to-blue-500"
          borderColor="border-blue-600"
        />
        <QuickActionCard
          icon={<Gift size={32} />}
          title="打开商店"
          subtitle="购买道具"
          color="pink"
          gradient="from-pink-400 to-pink-500"
          borderColor="border-pink-600"
        />
      </div>

      {/* 今日数据统计 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-100 p-6">
        <h3 className="text-xl font-extrabold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-purple-500" />
          今日数据
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="学习次数" value="0" emoji="📚" />
          <StatCard label="获得钻石" value="0" emoji="💎" />
          <StatCard label="购买商品" value="0" emoji="🛍️" />
        </div>
      </div>

      {/* 签到特效 */}
      {showCheckInEffect && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl animate-bounce">
            🎉
          </div>
          <div className="absolute text-4xl font-extrabold text-yellow-400 animate-pulse">
            +10 💎
          </div>
        </div>
      )}
    </div>
  );
}

// 快速功能卡片
function QuickActionCard({ icon, title, subtitle, gradient, borderColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl border-b-4 ${borderColor} p-6 text-white shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer`}>
      <div className="bg-white/30 rounded-full w-16 h-16 flex items-center justify-center mb-3 mx-auto">
        {icon}
      </div>
      <h4 className="font-bold text-lg text-center">{title}</h4>
      <p className="text-xs text-center opacity-90 font-semibold">{subtitle}</p>
    </div>
  );
}

// 统计卡片
function StatCard({ label, value, emoji }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-200 text-center">
      <div className="text-3xl mb-1">{emoji}</div>
      <p className="text-2xl font-extrabold text-purple-600">{value}</p>
      <p className="text-xs text-gray-600 font-semibold">{label}</p>
    </div>
  );
}

export default HomePage;

