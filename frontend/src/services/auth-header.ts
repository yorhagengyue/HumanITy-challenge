export default function authHeader() {
  const accessToken = localStorage.getItem('accessToken');
  
  console.log('Current accessToken:', accessToken ? 'exists' : 'not found');
  
  if (accessToken) {
    return { 'Authorization': 'Bearer ' + accessToken };
  } else {
    // 如果没有token，返回空对象而不是空Authorization头
    return {};
  }
} 