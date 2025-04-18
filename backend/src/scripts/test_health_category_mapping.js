const db = require('../models');
const HealthMetric = db.healthMetrics;
const HealthCalendarEvent = db.healthCalendarEvents;

// 测试健康类型到日历事件类别的映射
function mapHealthTypeToCategory(type) {
  let category = 'other'; // 默认为other
  
  // 映射健康类型到允许的类别
  switch (type) {
    case 'weight':
    case 'height':
    case 'bloodPressure':
    case 'heartRate':
    case 'bloodSugar':
      category = 'measurement'; // 各种测量类型都映射到measurement
      break;
    case 'sleep':
      category = 'other'; // 睡眠记录映射到other
      break;
    case 'exercise':
      category = 'exercise'; // 运动记录直接映射到exercise
      break;
    case 'water':
    case 'diet':
      category = 'diet'; // 饮食相关记录映射到diet
      break;
    case 'medication':
      category = 'medication'; // 药物记录直接映射到medication
      break;
    default:
      category = 'other'; // 其他类型默认映射到other
  }
  
  return category;
}

async function testMapping() {
  try {
    // 连接数据库
    await db.sequelize.authenticate();
    console.log('数据库连接已建立');
    
    // 测试各种健康类型的映射
    const typesToTest = ['weight', 'height', 'bloodPressure', 'sleep', 'exercise', 'water', 'diet', 'medication', 'other'];
    
    console.log('健康类型映射到日历事件类别:');
    typesToTest.forEach(type => {
      const category = mapHealthTypeToCategory(type);
      console.log(`${type} -> ${category}`);
    });
    
    // 获取数据库中定义的枚举值
    const [results] = await db.sequelize.query(
      "SHOW COLUMNS FROM health_calendar_events WHERE Field = 'category'"
    );
    
    if (results.length > 0 && results[0].Type) {
      const enumType = results[0].Type;
      const enumValues = enumType.match(/'([^']+)'/g).map(str => str.replace(/'/g, ''));
      console.log('\n数据库中category字段允许的值:');
      console.log(enumValues);
    }
    
    // 关闭数据库连接
    await db.sequelize.close();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 执行测试
testMapping();
