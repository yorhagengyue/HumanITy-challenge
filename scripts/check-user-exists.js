const axios = require('axios');

// API设置
const API_URL = 'http://localhost:8000/api';

// 用户信息
const userCredentials = {
  email: 'yorha16608@gmail.com',
  password: 'Password123!'
};

// 新用户信息
const newUserInfo = {
  username: 'yorha',
  email: 'yorha16608@gmail.com',
  password: 'Password123!',
  roles: ['user']
};

// 尝试登录来检查用户是否存在
async function checkUserExists() {
  try {
    console.log(`尝试登录用户 ${userCredentials.email}...`);
    
    const response = await axios.post(`${API_URL}/auth/signin`, userCredentials);
    
    console.log('=== 用户信息 ===');
    console.log(`ID: ${response.data.id}`);
    console.log(`用户名: ${response.data.username}`);
    console.log(`邮箱: ${response.data.email}`);
    console.log('=== 用户存在 ===');
    
    return true;
  } catch (error) {
    if (error.response) {
      // 请求已发出，服务器返回状态码不是2xx
      console.log(`服务器响应状态码: ${error.response.status}`);
      
      if (error.response.status === 404) {
        console.log(`用户 ${userCredentials.email} 不存在`);
        return false;
      } else if (error.response.status === 401) {
        console.log(`用户存在，但密码错误`);
        return true;
      } else {
        console.log('服务器错误:', error.response.data);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.log('无法连接到服务器。请确保后端服务器正在运行。');
    } else {
      // 请求配置出错
      console.log('请求设置错误:', error.message);
    }
    
    return false;
  }
}

// 创建新用户
async function createUser() {
  try {
    console.log(`尝试创建新用户 ${newUserInfo.email}...`);
    
    const response = await axios.post(`${API_URL}/auth/signup`, newUserInfo);
    
    console.log('用户创建成功!');
    console.log('响应:', response.data);
    
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`服务器响应状态码: ${error.response.status}`);
      console.log('响应数据:', error.response.data);
      
      if (error.response.status === 400 && error.response.data.message.includes('already')) {
        console.log('用户已存在');
        return true;
      }
    } else if (error.request) {
      console.log('无法连接到服务器。请确保后端服务器正在运行。');
    } else {
      console.log('请求设置错误:', error.message);
    }
    
    return false;
  }
}

// 主函数
async function main() {
  try {
    // 检查用户是否存在
    console.log('检查用户是否存在...');
    const userExists = await checkUserExists();
    
    // 如果用户不存在，尝试创建
    if (!userExists) {
      console.log('用户不存在，尝试创建...');
      const userCreated = await createUser();
      
      if (userCreated) {
        console.log('用户已成功创建或已存在');
      } else {
        console.log('无法创建用户');
      }
    } else {
      console.log('用户已存在，无需创建');
    }
    
    console.log('操作完成');
  } catch (error) {
    console.error('程序执行错误:', error);
  }
}

// 执行主函数
main(); 