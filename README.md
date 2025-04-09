# MyLife Companion

MyLife Companion is a comprehensive web application designed to support Singaporean youth with mental health challenges, time management, and personal development. The platform integrates calendar/task management, health data monitoring, personalized learning, and AI emotional support in a modular design with data-driven feedback.

## Features Implemented

The application currently includes the following key features:

- **Dashboard**: Overview of user's calendar events, tasks, health metrics, and emotional state
- **Calendar**: Schedule and manage events with detailed views and event creation
- **Tasks**: Create, track, and complete tasks with filtering and priority management
- **Health Data**: Monitor sleep, exercise, screen time, and other health metrics
- **Emotional Support**: AI-powered chat interface for emotional support and resources
- **Profile**: User profile management with personal information and preferences
- **Settings**: Application configuration and data management

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: React hooks
- **Routing**: React Router
- **Charts**: Chart.js/D3.js (placeholders for now)

## Project Structure

```
mylife-companion/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx     # Application header
│   │   └── Sidebar.tsx    # Navigation sidebar
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Calendar.tsx   # Calendar management
│   │   ├── Tasks.tsx      # Task management
│   │   ├── HealthData.tsx # Health metrics tracking
│   │   ├── EmotionalSupport.tsx # AI support chat
│   │   ├── Profile.tsx    # User profile
│   │   └── Settings.tsx   # App settings
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── services/          # API and service integrations
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Images and media files
│   ├── styles/            # Global styles
│   └── App.tsx            # Main App component
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mylife-companion.git
cd mylife-companion

# Install dependencies
npm install

# Start development server
npm start
```

## Next Steps and Future Improvements

1. **Backend Integration**: Implement a backend server to store and retrieve user data
2. **Authentication**: Add user login and registration functionality
3. **Data Visualization**: Integrate real charts and graphs for health metrics
4. **AI Model**: Improve the emotional support AI with a proper NLP model
5. **Notifications**: Implement push notifications for reminders
6. **Mobile App**: Develop a mobile application using React Native
7. **Data Privacy**: Implement robust data encryption and privacy controls
8. **Collaborative Features**: Add sharing functionality with parents, teachers, or counselors

## License

[MIT License](LICENSE)
