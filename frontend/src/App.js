import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Clock, Home as HomeIcon, Award, Sparkles, TestTube } from 'lucide-react';
import HomePage from './components/HomePage';
import StudyTimer from './components/StudyTimer';
import ShopPage from './components/ShopPage';
import InventoryPage from './components/InventoryPage';
import ApiTestPage from './components/ApiTestPage';
import { getApiUrl } from './config/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('tomAppUserId');
    const savedUsername = localStorage.getItem('tomAppUsername');
    if (savedUserId && savedUsername) {
      setUserId(parseInt(savedUserId));
      setUsername(savedUsername);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = (id, name) => {
    setUserId(id);
    setUsername(name);
    localStorage.setItem('tomAppUserId', id.toString());
    localStorage.setItem('tomAppUsername', name);
    setShowLogin(false);
  };

  const renderPage = () => {
    if (!userId) return null;

    switch (currentPage) {
      case 'home':
        return <HomePage userId={userId} username={username} />;
      case 'study':
        return <StudyTimer userId={userId} />;
      case 'shop':
        return <ShopPage userId={userId} />;
      case 'inventory':
        return <InventoryPage userId={userId} />;
      case 'test':
        return <ApiTestPage />;
      default:
        return <HomePage userId={userId} username={username} />;
    }
  };

  if (showLogin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-kawaii-pink rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-kawaii-purple rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-kawaii-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 主内容 - 添加底部内边距避免被导航栏遮挡 */}
      <div className="relative z-10 pb-28">
        {renderPage()}
      </div>

      {/* 底部导航栏 - 可爱糖果风格 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t-4 border-pink-200 shadow-2xl z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton
              icon={<HomeIcon size={20} />}
              label="主页"
              active={currentPage === 'home'}
              onClick={() => setCurrentPage('home')}
              color="pink"
            />
            <NavButton
              icon={<Clock size={20} />}
              label="学习"
              active={currentPage === 'study'}
              onClick={() => setCurrentPage('study')}
              color="purple"
            />
            <NavButton
              icon={<ShoppingBag size={20} />}
              label="商店"
              active={currentPage === 'shop'}
              onClick={() => setCurrentPage('shop')}
              color="blue"
            />
            <NavButton
              icon={<Award size={20} />}
              label="背包"
              active={currentPage === 'inventory'}
              onClick={() => setCurrentPage('inventory')}
              color="yellow"
            />
            <NavButton
              icon={<TestTube size={20} />}
              label="测试"
              active={currentPage === 'test'}
              onClick={() => setCurrentPage('test')}
              color="green"
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

// 导航按钮组件
function NavButton({ icon, label, active, onClick, color }) {
  const colorClasses = {
    pink: 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-600',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-500 border-purple-600',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-600',
    green: 'bg-gradient-to-br from-green-400 to-green-500 border-green-600',
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
        active
          ? `${colorClasses[color]} border-b-4 text-white shadow-lg scale-110`
          : 'text-gray-400 hover:text-gray-600 hover:scale-105 active:scale-95'
      }`}
    >
      <div className={active ? 'animate-bounce-slow' : ''}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

// 登录界面组件
function LoginScreen({ onLogin }) {
  const [inputUsername, setInputUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!inputUsername.trim()) {
      alert('请输入用户名哦~ 💖');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/users/username/${inputUsername}`));
      if (response.ok) {
        const user = await response.json();
        onLogin(user.id, user.username);
      } else {
        alert('用户不存在，是否要创建新用户呢？ ✨');
        handleRegister();
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败啦~ 请重试 (｡•́︿•̀｡)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername })
      });

      if (response.ok) {
        const user = await response.json();
        onLogin(user.id, user.username);
      } else {
        alert('注册失败啦~ 换个名字试试？ 🌟');
      }
    } catch (error) {
      console.error('注册失败:', error);
      alert('注册失败啦~ 请重试 (｡•́︿•̀｡)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      {/* 装饰性元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 text-pink-300 animate-pulse" size={40} />
        <Heart className="absolute top-40 right-40 text-purple-300 animate-bounce" size={50} fill="currentColor" />
        <Sparkles className="absolute bottom-40 right-20 text-blue-300 animate-pulse" size={35} />
        <Heart className="absolute bottom-20 left-40 text-yellow-300 animate-bounce" size={45} fill="currentColor" />
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl border-4 border-pink-200 p-10 max-w-md w-full">
        {/* 顶部装饰 */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-pink-400 to-purple-400 rounded-full p-6 border-4 border-white shadow-xl animate-float">
            <span className="text-6xl">🐱</span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          汤姆猫学习版
        </h1>
        <p className="text-center text-gray-500 mb-8 font-semibold">学习赚钻石，装扮小猫咪~ ✨</p>

        {/* 输入框 */}
        <div className="mb-6">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="输入你的名字呀~ 💕"
            className="w-full px-6 py-4 rounded-2xl border-4 border-pink-200 focus:border-pink-400 focus:outline-none text-lg font-semibold text-gray-700 transition-all"
            disabled={isLoading}
          />
        </div>

        {/* 按钮组 */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-pink-400 to-pink-500 text-white px-8 py-4 rounded-2xl border-b-4 border-pink-600 active:border-b-0 active:translate-y-1 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:from-pink-500 hover:to-pink-600 disabled:opacity-50"
          >
            <Heart size={24} fill="currentColor" />
            {isLoading ? '登录中...' : '开始玩耍'}
          </button>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-purple-400 to-purple-500 text-white px-8 py-4 rounded-2xl border-b-4 border-purple-600 active:border-b-0 active:translate-y-1 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50"
          >
            <Sparkles size={24} />
            {isLoading ? '注册中...' : '创建新账号'}
          </button>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-sm text-gray-400 mt-6">
          首次注册送 50 钻石哦~ 💎
        </p>
      </div>
    </div>
  );
}

export default App;

