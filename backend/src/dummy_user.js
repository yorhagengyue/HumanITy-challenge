// 该脚本用于模拟创建一个yorha16608@gmail.com用户

// 用户信息 (假设这个用户在服务器中已存在)
const dummyUser = {
  id: 1,
  username: 'yorha',
  email: 'yorha16608@gmail.com',
  role: 'user'
};

// 导出用户信息
module.exports = dummyUser;

console.log(`用户 ${dummyUser.email} 已在系统中存在。`);
console.log('用户ID: ' + dummyUser.id);
console.log('用户名: ' + dummyUser.username);
console.log('角色: ' + dummyUser.role); 