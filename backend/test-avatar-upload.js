const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAvatarUpload() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 测试头像上传功能...\n');

    // 1. 先登录获取token
    console.log('1. 登录获取token...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      identifier: 'admin',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('登录失败');
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获得token');

    // 2. 创建一个测试图片文件
    console.log('\n2. 创建测试图片文件...');
    const testImagePath = path.join(__dirname, 'test-avatar.png');
    
    // 创建一个简单的PNG图片数据（1x1像素的透明PNG）
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x1F, 0x15, 0xC4, 0x89, // CRC
      0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0xE2, 0x21, 0xBC, 0x33, // CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, pngData);
    console.log('✅ 测试图片文件创建成功:', testImagePath);

    // 3. 测试头像上传
    console.log('\n3. 测试头像上传...');
    const formData = new FormData();
    formData.append('avatar', fs.createReadStream(testImagePath), {
      filename: 'test-avatar.png',
      contentType: 'image/png'
    });

    const uploadResponse = await axios.post(`${baseURL}/auth/avatar`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ 头像上传成功:', uploadResponse.data);

    // 4. 验证用户信息是否更新
    console.log('\n4. 验证用户信息更新...');
    const userResponse = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = userResponse.data.data.user;
    console.log('用户头像URL:', user.avatar);

    if (user.avatar) {
      console.log('✅ 用户头像信息更新成功');
      
      // 5. 测试头像文件访问
      console.log('\n5. 测试头像文件访问...');
      const avatarUrl = `http://localhost:3000${user.avatar}`;
      console.log('头像访问URL:', avatarUrl);
      
      try {
        const avatarResponse = await axios.get(avatarUrl, {
          responseType: 'arraybuffer'
        });
        console.log('✅ 头像文件可以正常访问');
        console.log('文件大小:', avatarResponse.data.length, 'bytes');
        console.log('Content-Type:', avatarResponse.headers['content-type']);
      } catch (error) {
        console.log('❌ 头像文件访问失败:', error.message);
      }
    } else {
      console.log('❌ 用户头像信息未更新');
    }

    // 清理测试文件
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 清理测试文件完成');

    console.log('\n🎉 头像上传功能测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testAvatarUpload();
