const axios = require('axios');

async function testRegisterAdmin() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 测试新用户注册自动获得管理员权限...\n');

    // 生成随机用户名避免冲突
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
      username: `testuser${randomId}`,
      email: `testuser${randomId}@example.com`,
      password: 'test123456',
      nickname: `测试用户${randomId}`
    };

    console.log('1. 测试用户注册...');
    console.log('注册信息:', testUser);
    
    const registerResponse = await axios.post(`${baseURL}/auth/register`, testUser);
    
    console.log('✅ 注册成功:', registerResponse.data);
    
    // 检查用户角色
    const user = registerResponse.data.data.user;
    console.log('\n📋 用户信息验证:');
    console.log('- 用户名:', user.username);
    console.log('- 邮箱:', user.email);
    console.log('- 昵称:', user.nickname);
    console.log('- 角色:', user.role);
    
    if (user.role === 'admin') {
      console.log('✅ 用户角色验证通过：新用户自动获得管理员权限');
    } else {
      console.log('❌ 用户角色验证失败：期望 admin，实际', user.role);
      return;
    }

    // 测试管理员权限
    const token = registerResponse.data.data.token;
    console.log('\n2. 测试管理员权限...');
    
    const adminResponse = await axios.get(`${baseURL}/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 管理员权限验证通过：可以访问管理后台API');
    console.log('统计数据:', adminResponse.data.data);

    // 测试文章管理权限
    console.log('\n3. 测试文章管理权限...');
    
    const articlesResponse = await axios.get(`${baseURL}/admin/articles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 文章管理权限验证通过：可以访问文章管理API');
    console.log('文章列表:', articlesResponse.data.data.pagination);

    console.log('\n🎉 所有测试通过！新用户注册自动获得管理员权限功能正常工作！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testRegisterAdmin();
