# MyLife Companion - 前后端分离项目

这是一个采用前后端分离架构的综合性Web应用程序，旨在支持青少年的心理健康和个人发展。

## 项目结构

项目采用前后端分离架构:

```
mylife-companion/
├── frontend/              # React前端应用
│   ├── public/            # 静态资源
│   ├── src/               # 源代码
│   │   ├── components/    # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── contexts/      # React上下文
│   │   ├── styles/        # 样式文件
│   │   └── ...
│   └── package.json       # 前端依赖
│
├── backend/               # Node.js后端API
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middlewares/   # 中间件
│   │   └── server.js      # 服务器入口
│   └── package.json       # 后端依赖
│
├── database_setup.sql     # 数据库初始化脚本
└── PROJECT_STATUS.md      # 项目状态和API文档
```

## 技术栈

### 前端
- React (TypeScript)
- Material UI
- React Router
- Chart.js
- Axios

### 后端
- Node.js
- Express
- Sequelize ORM
- MySQL
- JWT认证

## 开发步骤

### 后端开发
1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 创建环境变量文件：
   - 复制 `.env.example` 为 `.env`
   - 根据实际环境修改配置
4. 在MySQL中执行数据库脚本：`mysql -u root -p < ../database_setup.sql`
5. 启动开发服务器：`npm run dev`

### 前端开发
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm start`

## 测试应用

### 前端测试
1. 确保前端依赖已安装：`cd frontend && npm install`
2. 启动前端测试：`npm test`

### 后端测试
1. 确保后端依赖已安装：`cd backend && npm install`
2. 启动后端测试：`npm test`

## API文档

详细的API接口设计和文档请参阅 [PROJECT_STATUS.md](./PROJECT_STATUS.md) 文件。
