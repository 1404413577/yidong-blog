const axios = require('axios');

async function testAuth() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 测试用户认证API...\n');

    // 1. 测试登录
    console.log('1. 测试管理员登录...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      identifier: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ 登录成功:', loginResponse.data);
    const token = loginResponse.data.data.token;
    console.log('🔑 Token:', token.substring(0, 50) + '...\n');

    // 2. 测试获取当前用户信息
    console.log('2. 测试获取当前用户信息...');
    const userResponse = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 用户信息:', userResponse.data);
    console.log();

    // 3. 测试管理后台统计数据
    console.log('3. 测试管理后台统计数据...');
    const statsResponse = await axios.get(`${baseURL}/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 统计数据:', statsResponse.data);
    console.log();

    // 4. 测试获取我的文章列表
    console.log('4. 测试获取我的文章列表...');
    const articlesResponse = await axios.get(`${baseURL}/admin/articles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 文章列表:', articlesResponse.data);
    console.log();

    // 5. 测试用户注册
    console.log('5. 测试用户注册...');
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        nickname: '测试用户'
      });
      
      console.log('✅ 注册成功:', registerResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('⚠️ 注册失败（可能用户已存在）:', error.response.data.message);
      } else {
        throw error;
      }
    }

    console.log('\n🎉 所有认证API测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testAuth();
