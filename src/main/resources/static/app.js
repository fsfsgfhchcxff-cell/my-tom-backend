// API 基础地址
const API_BASE = 'http://localhost:8081/api';

// 全局状态
let currentUser = null;
let currentSessionId = null;
let timerInterval = null;
let studyStartTime = null;
let allItems = [];
let currentCategory = 'FOOD';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkExistingUser();
});

// 初始化事件监听器
function initEventListeners() {
    // 登录/注册
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    
    // 签到
    document.getElementById('checkinBtn').addEventListener('click', handleCheckIn);
    
    // 学习计时
    document.getElementById('startStudyBtn').addEventListener('click', startStudy);
    document.getElementById('endStudyBtn').addEventListener('click', endStudy);
    
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // 分类切换
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => switchCategory(btn.dataset.type));
    });
}

// 检查已有用户
function checkExistingUser() {
    const savedUserId = localStorage.getItem('tomAppUserId');
    if (savedUserId) {
        loadUser(savedUserId);
    } else {
        showLoginModal();
    }
}

// 显示登录模态框
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// 隐藏登录模态框
function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// 处理登录
async function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        alert('请输入用户名！');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/username/${username}`);
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            localStorage.setItem('tomAppUserId', user.id);
            hideLoginModal();
            updateUI();
            loadItems();
        } else {
            alert('用户不存在，请先注册！');
        }
    } catch (error) {
        console.error('登录失败:', error);
        alert('登录失败，请重试！');
    }
}

// 处理注册
async function handleRegister() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        alert('请输入用户名！');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            localStorage.setItem('tomAppUserId', user.id);
            hideLoginModal();
            alert('注册成功！赠送50钻石！🎉');
            updateUI();
            loadItems();
        } else {
            const error = await response.json();
            alert(error.error || '注册失败！');
        }
    } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请重试！');
    }
}

// 加载用户信息
async function loadUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (response.ok) {
            currentUser = await response.json();
            hideLoginModal();
            updateUI();
            loadItems();
        } else {
            localStorage.removeItem('tomAppUserId');
            showLoginModal();
        }
    } catch (error) {
        console.error('加载用户失败:', error);
        showLoginModal();
    }
}

// 更新UI
function updateUI() {
    if (!currentUser) return;
    
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('diamondBalance').textContent = currentUser.diamondBalance;
    document.getElementById('totalStudyMinutes').textContent = currentUser.totalStudyMinutes || 0;
}

// 处理签到
async function handleCheckIn() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}/checkin`, {
            method: 'POST'
        });
        
        const data = await response.json();
        if (response.ok) {
            currentUser = data.user;
            updateUI();
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('签到失败:', error);
        alert('签到失败，请重试！');
    }
}

// 开始学习
async function startStudy() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/study/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        
        const data = await response.json();
        if (response.ok) {
            currentSessionId = data.session.id;
            studyStartTime = new Date();
            startTimer();
            document.getElementById('startStudyBtn').disabled = true;
            document.getElementById('endStudyBtn').disabled = false;
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('开始学习失败:', error);
        alert('开始学习失败，请重试！');
    }
}

// 结束学习
async function endStudy() {
    if (!currentUser || !currentSessionId) return;
    
    try {
        const response = await fetch(`${API_BASE}/study/end/${currentSessionId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        if (response.ok) {
            stopTimer();
            currentSessionId = null;
            document.getElementById('startStudyBtn').disabled = false;
            document.getElementById('endStudyBtn').disabled = true;
            alert(data.message);
            loadUser(currentUser.id); // 刷新用户信息
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('结束学习失败:', error);
        alert('结束学习失败，请重试！');
    }
}

// 启动计时器
function startTimer() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = now - studyStartTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('timerDisplay').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// 停止计时器
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById('timerDisplay').textContent = '00:00:00';
}

// 切换标签
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
    
    if (tabName === 'shop') {
        loadItems();
    } else if (tabName === 'inventory') {
        loadInventory();
    }
}

// 切换分类
function switchCategory(type) {
    currentCategory = type;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    displayItems(type);
}

// 加载商品
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE}/items`);
        if (response.ok) {
            allItems = await response.json();
            displayItems(currentCategory);
        }
    } catch (error) {
        console.error('加载商品失败:', error);
    }
}

// 显示商品
function displayItems(type) {
    const itemsList = document.getElementById('itemsList');
    const filteredItems = allItems.filter(item => item.type === type);
    
    itemsList.innerHTML = filteredItems.map(item => `
        <div class="item-card" onclick="purchaseItem(${item.id})">
            <div class="item-icon">${getItemEmoji(item.name)}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">💎 ${item.price}</div>
        </div>
    `).join('');
}

// 获取物品表情符号
function getItemEmoji(name) {
    const match = name.match(/[\u{1F300}-\u{1F9FF}]/u);
    return match ? match[0] : '📦';
}

// 购买商品
async function purchaseItem(itemId) {
    if (!currentUser) return;
    
    if (!confirm('确定要购买这个商品吗？')) return;
    
    try {
        const response = await fetch(`${API_BASE}/shop/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, itemId })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loadUser(currentUser.id); // 刷新用户信息
            loadInventory();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('购买失败:', error);
        alert('购买失败，请重试！');
    }
}

// 加载背包
async function loadInventory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/shop/inventory/${currentUser.id}`);
        if (response.ok) {
            const inventory = await response.json();
            displayInventory(inventory);
            updateCatDisplay(inventory);
        }
    } catch (error) {
        console.error('加载背包失败:', error);
    }
}

// 显示背包
async function displayInventory(inventory) {
    const inventoryList = document.getElementById('inventoryList');
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = '<p style="text-align: center; color: #999;">背包空空如也，快去商店购买吧！</p>';
        return;
    }
    
    const inventoryWithItems = await Promise.all(
        inventory.map(async inv => {
            const item = allItems.find(i => i.id === inv.itemId);
            return { ...inv, item };
        })
    );
    
    inventoryList.innerHTML = inventoryWithItems.map(inv => `
        <div class="item-card" onclick="equipItem(${inv.id})" style="position: relative;">
            <div class="item-icon">${getItemEmoji(inv.item.name)}</div>
            <div class="item-name">${inv.item.name}</div>
            ${inv.quantity > 1 ? `<div class="item-quantity">${inv.quantity}</div>` : ''}
            ${inv.isEquipped ? '<div class="equipped-badge">已装备</div>' : ''}
        </div>
    `).join('');
}

// 装备物品
async function equipItem(inventoryId) {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/shop/equip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, inventoryId })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loadInventory();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('装备失败:', error);
        alert('操作失败，请重试！');
    }
}

// 更新汤姆猫显示
async function updateCatDisplay(inventory) {
    const clothesDiv = document.getElementById('catClothes');
    const furnitureDiv = document.getElementById('roomFurniture');
    
    // 显示已装备的衣服
    const equippedCloth = inventory.find(inv => inv.isEquipped && 
        allItems.find(i => i.id === inv.itemId && i.type === 'CLOTH'));
    
    if (equippedCloth) {
        const item = allItems.find(i => i.id === equippedCloth.itemId);
        clothesDiv.textContent = getItemEmoji(item.name);
    } else {
        clothesDiv.textContent = '';
    }
    
    // 显示已装备的家具
    const equippedFurniture = inventory.filter(inv => inv.isEquipped && 
        allItems.find(i => i.id === inv.itemId && i.type === 'FURNITURE'));
    
    furnitureDiv.innerHTML = equippedFurniture.map(inv => {
        const item = allItems.find(i => i.id === inv.itemId);
        return `<div class="furniture-item">${getItemEmoji(item.name)}</div>`;
    }).join('');
}

