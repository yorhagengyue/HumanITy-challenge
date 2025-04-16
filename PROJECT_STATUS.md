# MyLife Companion - Project Status

## Overview

MyLife Companion is a comprehensive web application designed to support Singaporean youth with mental health challenges and personal development. The platform integrates daily planning, health tracking, emotional support, and educational resources in a unified, user-friendly interface.

## ✅ Completed Features

1. **Project Setup & Infrastructure**
   - Initialized React TypeScript project using Create React App
   - Configured Material UI with React 19 compatibility fixes
   - Established project structure and component organization
   - Set up GitHub repository and version control workflow

2. **UI Components Development**
   - **Dashboard**: Implemented card-based layout with key information widgets
     - Today's focus area
     - Calendar events preview
     - Task management overview
     - Health metrics visualization
     - Mood tracking interface
     - Emotional support access point
   
   - **Calendar**: Created interactive calendar component
     - Monthly view with navigation
     - Day cell rendering with event display
     - Event creation dialog
     - Visual indicators for different event types
     - Hover states and interactive elements
   
   - **Emotional Support**: Built AI companion interface
     - Chat-based interaction system
     - Resource browsing with filtering
     - Visual categorization of resources
     - Tag-based filtering system
     - Animation effects for engagement

3. **Visual Design & Animation**
   - Implemented fade-in and slide animations for content
   - Added hover effects for interactive elements
   - Created pulsing animations for attention-drawing elements
   - Used gradient backgrounds and card elevation for depth
   - Applied consistent color theming across components
   - Enhanced typography with gradient text effects

4. **Technical Solutions**
   - Resolved Material UI version compatibility issues with React 19
   - Refactored Grid components to Box with flexbox for better compatibility
   - Downgraded specific dependencies (date-fns) for component compatibility
   - Implemented responsive layouts across all components
   - Added TypeScript type safety throughout the application

## 📝 Todo List

1. **Core Functionality Expansion**
   - [ ] Complete task management system with CRUD operations
   - [ ] Implement health data tracking with charts and trends
   - [ ] Build user profile management system
   - [ ] Create settings page with user preferences
   - [ ] Design and implement notification system

2. **Data & Backend Development**
   - [ ] Design and create backend API structure
   - [ ] Implement data persistence and storage
   - [ ] Replace mock data with real data services
   - [ ] Build data synchronization mechanisms
   - [ ] Create offline functionality support

3. **User Experience Enhancements**
   - [ ] Refine mobile responsiveness across all components
   - [ ] Add dark mode support with theme switching
   - [ ] Implement accessibility optimizations (WCAG compliance)
   - [ ] Improve loading performance and add skeleton screens
   - [ ] Add guided tours and onboarding experience

4. **Testing & Quality Assurance**
   - [ ] Write unit tests for core components
   - [ ] Implement integration tests for feature flows
   - [ ] Conduct user experience testing
   - [ ] Perform code reviews and optimizations
   - [ ] Add error handling and recovery mechanisms

5. **Deployment & Release**
   - [ ] Configure production build optimizations
   - [ ] Deploy to cloud service provider
   - [ ] Set up CI/CD pipeline
   - [ ] Integrate monitoring and performance analytics
   - [ ] Create documentation for maintenance and future development

## Next Priority Items

1. Complete the task management component development
2. Build health data visualization system
3. Begin user authentication system implementation
4. Conduct initial user testing with prototype

## Project Repository

The project is hosted on GitHub at: [https://github.com/yorhagengyue/HumanITy-challenge](https://github.com/yorhagengyue/HumanITy-challenge)

## Last Updated

April 9, 2025 

## API 接口设计

以下是MyLife Companion应用程序的API接口设计，用于与MySQL数据库进行交互。

### 1. 用户认证接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/auth/register` | POST | 注册新用户 | `username`, `email`, `password`, `fullName` | `userId`, `token`, `status` |
| `/api/auth/login` | POST | 用户登录 | `email`, `password` | `userId`, `token`, `status` |
| `/api/auth/refresh` | POST | 刷新认证token | `refreshToken` | `newToken`, `status` |
| `/api/auth/logout` | POST | 用户登出 | - | `status` |
| `/api/auth/password/reset` | POST | 请求密码重置 | `email` | `status` |
| `/api/auth/password/confirm` | POST | 确认密码重置 | `token`, `newPassword` | `status` |

### 2. 用户资料接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/users/profile` | GET | 获取用户资料 | - | 用户资料对象 |
| `/api/users/profile` | PUT | 更新用户资料 | 用户资料对象 | 更新后的用户资料对象 |
| `/api/users/preferences` | GET | 获取用户偏好设置 | - | 用户偏好对象 |
| `/api/users/preferences` | PUT | 更新用户偏好设置 | 用户偏好对象 | 更新后的用户偏好对象 |
| `/api/users/avatar` | POST | 上传用户头像 | `avatarFile` | 头像URL |

### 3. 任务管理接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/tasks` | GET | 获取任务列表 | `filter`, `sort`, `page`, `limit` | 任务列表数组 |
| `/api/tasks` | POST | 创建新任务 | 任务对象 | 创建的任务对象 |
| `/api/tasks/:taskId` | GET | 获取特定任务详情 | `taskId` | 任务详情对象 |
| `/api/tasks/:taskId` | PUT | 更新任务 | `taskId`, 任务对象 | 更新后的任务对象 |
| `/api/tasks/:taskId` | DELETE | 删除任务 | `taskId` | 操作状态 |
| `/api/tasks/:taskId/status` | PATCH | 更新任务状态 | `taskId`, `status` | 更新后的任务对象 |
| `/api/tasks/categories` | GET | 获取任务分类 | - | 分类列表数组 |
| `/api/tasks/statistics` | GET | 获取任务统计信息 | `timeRange` | 统计数据对象 |

### 4. 日历与事件接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/calendar/events` | GET | 获取日历事件 | `startDate`, `endDate`, `categories` | 事件列表数组 |
| `/api/calendar/events` | POST | 创建新事件 | 事件对象 | 创建的事件对象 |
| `/api/calendar/events/:eventId` | GET | 获取特定事件详情 | `eventId` | 事件详情对象 |
| `/api/calendar/events/:eventId` | PUT | 更新事件 | `eventId`, 事件对象 | 更新后的事件对象 |
| `/api/calendar/events/:eventId` | DELETE | 删除事件 | `eventId` | 操作状态 |
| `/api/calendar/categories` | GET | 获取事件分类 | - | 分类列表数组 |
| `/api/calendar/reminders` | GET | 获取事件提醒 | `timeRange` | 提醒列表数组 |

### 5. 健康数据接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/health/metrics` | GET | 获取健康指标数据 | `metricType`, `startDate`, `endDate` | 健康数据数组 |
| `/api/health/metrics` | POST | 添加健康指标数据 | 健康数据对象 | 创建的数据对象 |
| `/api/health/metrics/:metricId` | PUT | 更新健康数据 | `metricId`, 健康数据对象 | 更新后的数据对象 |
| `/api/health/sleep` | GET | 获取睡眠数据 | `startDate`, `endDate` | 睡眠数据数组 |
| `/api/health/sleep` | POST | 添加睡眠记录 | 睡眠数据对象 | 创建的睡眠记录 |
| `/api/health/activity` | GET | 获取活动数据 | `startDate`, `endDate` | 活动数据数组 |
| `/api/health/activity` | POST | 添加活动记录 | 活动数据对象 | 创建的活动记录 |
| `/api/health/screen-time` | GET | 获取屏幕使用时间 | `startDate`, `endDate` | 屏幕时间数据数组 |
| `/api/health/screen-time` | POST | 添加屏幕时间记录 | 屏幕时间对象 | 创建的屏幕时间记录 |
| `/api/health/statistics` | GET | 获取健康统计概览 | `timeRange` | 统计数据对象 |

### 6. 情绪支持接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/mood/logs` | GET | 获取情绪日志 | `startDate`, `endDate` | 情绪日志数组 |
| `/api/mood/logs` | POST | 创建情绪日志 | 情绪数据对象 | 创建的情绪记录 |
| `/api/mood/today` | GET | 获取今日情绪状态 | - | 情绪状态对象 |
| `/api/mood/statistics` | GET | 获取情绪统计数据 | `timeRange` | 统计数据对象 |
| `/api/support/chat` | POST | 发送对话消息 | 消息对象 | 回复消息对象 |
| `/api/support/chat/history` | GET | 获取对话历史 | `page`, `limit` | 对话历史数组 |
| `/api/support/resources` | GET | 获取支持资源 | `category`, `tags` | 资源列表数组 |
| `/api/support/resources/:resourceId` | GET | 获取特定资源详情 | `resourceId` | 资源详情对象 |

### 7. 学习与目标接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/goals` | GET | 获取目标列表 | `status`, `category` | 目标列表数组 |
| `/api/goals` | POST | 创建新目标 | 目标对象 | 创建的目标对象 |
| `/api/goals/:goalId` | GET | 获取特定目标详情 | `goalId` | 目标详情对象 |
| `/api/goals/:goalId` | PUT | 更新目标 | `goalId`, 目标对象 | 更新后的目标对象 |
| `/api/goals/:goalId` | DELETE | 删除目标 | `goalId` | 操作状态 |
| `/api/goals/:goalId/progress` | PATCH | 更新目标进度 | `goalId`, `progress` | 更新后的目标对象 |
| `/api/learning/resources` | GET | 获取学习资源 | `category`, `tags` | 资源列表数组 |
| `/api/learning/progress` | GET | 获取学习进度 | `courseId` | 进度数据对象 |

### 8. 通知接口

| 接口路径 | 方法 | 描述 | 参数 | 返回值 |
|---------|------|------|------|-------|
| `/api/notifications` | GET | 获取通知列表 | `read`, `page`, `limit` | 通知列表数组 |
| `/api/notifications/count` | GET | 获取未读通知数量 | - | 未读数量 |
| `/api/notifications/:notificationId` | PUT | 标记通知为已读 | `notificationId` | 更新后的通知对象 |
| `/api/notifications/read-all` | PUT | 标记所有通知为已读 | - | 操作状态 |
| `/api/notifications/settings` | GET | 获取通知设置 | - | 通知设置对象 |
| `/api/notifications/settings` | PUT | 更新通知设置 | 设置对象 | 更新后的设置对象 |

### 数据模型设计（MySQL数据库表）

以下是对应API接口的主要数据库表设计：

1. **users** - 用户基本信息
   - user_id (PK)
   - username
   - email
   - password_hash
   - full_name
   - created_at
   - updated_at
   - last_login
   - status

2. **user_preferences** - 用户偏好设置
   - preference_id (PK)
   - user_id (FK)
   - theme_mode
   - language
   - notification_settings (JSON)
   - privacy_settings (JSON)
   - updated_at

3. **tasks** - 任务信息
   - task_id (PK)
   - user_id (FK)
   - title
   - description
   - status
   - priority
   - category_id (FK)
   - due_date
   - reminder_time
   - created_at
   - updated_at

4. **task_categories** - 任务分类
   - category_id (PK)
   - user_id (FK)
   - name
   - color
   - icon

5. **calendar_events** - 日历事件
   - event_id (PK)
   - user_id (FK)
   - title
   - description
   - location
   - start_time
   - end_time
   - all_day
   - category_id (FK)
   - recurrence_rule
   - reminder_time
   - created_at
   - updated_at

6. **health_metrics** - 健康指标数据
   - metric_id (PK)
   - user_id (FK)
   - metric_type (睡眠、运动、屏幕时间等)
   - value
   - unit
   - recorded_at
   - notes
   - source

7. **mood_logs** - 情绪日志
   - log_id (PK)
   - user_id (FK)
   - mood_score
   - energy_level
   - notes
   - factors (JSON)
   - recorded_at

8. **support_chats** - 情绪支持对话
   - message_id (PK)
   - user_id (FK)
   - content
   - is_user_message
   - created_at
   - related_resources (JSON)

9. **learning_goals** - 学习目标
   - goal_id (PK)
   - user_id (FK)
   - title
   - description
   - category
   - target_date
   - progress
   - status
   - created_at
   - updated_at

10. **notifications** - 通知信息
    - notification_id (PK)
    - user_id (FK)
    - type
    - title
    - content
    - related_id
    - is_read
    - created_at
    - expiry_date

### API实现技术栈建议

- **后端框架**: Express.js (Node.js)
- **数据库**: MySQL
- **ORM**: Sequelize 或 TypeORM
- **认证**: JWT (JSON Web Tokens)
- **API文档**: Swagger/OpenAPI
- **数据验证**: Joi 或 Yup
- **安全措施**: HTTPS, CORS, Helmet.js, Rate Limiting 