const fs = require('fs');
const path = require('path');

// 手动加载环境变量
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

const { query } = require('../backend/src/config/database');

async function exportDatabase() {
  try {
    console.log('开始导出数据库表结构...');
    
    // 获取所有表名
    const tables = await query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    console.log(`找到 ${tableNames.length} 个表:`, tableNames);
    
    let sqlContent = `-- =============================================
-- 移动博客系统数据库表结构
-- 生成时间: ${new Date().toLocaleString('zh-CN')}
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

`;

    // 为每个表导出结构
    for (const tableName of tableNames) {
      console.log(`导出表: ${tableName}`);
      
      // 获取建表语句
      const createTableResult = await query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSQL = createTableResult[0]['Create Table'];
      
      sqlContent += `-- ----------------------------
-- Table structure for ${tableName}
-- ----------------------------
DROP TABLE IF EXISTS \`${tableName}\`;
${createTableSQL};

`;
    }
    
    sqlContent += `SET FOREIGN_KEY_CHECKS = 1;
`;

    // 保存到文件
    const outputPath = path.join(__dirname, 'database-structure.sql');
    fs.writeFileSync(outputPath, sqlContent, 'utf8');
    
    console.log(`✅ 数据库表结构已导出到: ${outputPath}`);
    
    // 同时导出表结构信息（用于文档）
    await exportTableInfo(tableNames);
    
  } catch (error) {
    console.error('❌ 导出失败:', error);
  }
  
  process.exit(0);
}

async function exportTableInfo(tableNames) {
  console.log('导出表结构信息...');
  
  let infoContent = `# 易东博客系统数据库表结构说明

生成时间: ${new Date().toLocaleString('zh-CN')}

## 数据库概览

本项目包含 ${tableNames.length} 个数据表：

`;

  for (const tableName of tableNames) {
    console.log(`分析表: ${tableName}`);
    
    // 获取表结构
    const columns = await query(`DESCRIBE \`${tableName}\``);
    
    // 获取表注释
    const tableInfo = await query(`
      SELECT TABLE_COMMENT 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
    `, [tableName]);
    
    const tableComment = tableInfo[0]?.TABLE_COMMENT || '';
    
    infoContent += `### ${tableName} ${tableComment ? `- ${tableComment}` : ''}

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
`;

    columns.forEach(column => {
      infoContent += `| ${column.Field} | ${column.Type} | ${column.Null} | ${column.Key || ''} | ${column.Default || ''} | ${column.Extra || ''} |\n`;
    });
    
    infoContent += '\n';
  }
  
  // 保存表结构信息
  const infoPath = path.join(__dirname, 'database-info.md');
  fs.writeFileSync(infoPath, infoContent, 'utf8');
  
  console.log(`✅ 表结构信息已导出到: ${infoPath}`);
}

exportDatabase();
