import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { keyframes } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MoodIcon from '@mui/icons-material/Mood';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import InsightsIcon from '@mui/icons-material/Insights';
import ChatIcon from '@mui/icons-material/Chat';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'exercise';
  icon: React.ReactNode;
  tags: string[];
  saved: boolean;
}

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
  }
`;

const EmotionalSupport: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your emotional support companion. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<'chat' | 'resources'>('chat');
  const [savedResources, setSavedResources] = useState<number[]>([2]);
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get all unique tags from resources
  const allTags = Array.from(new Set(messages.flatMap(message => message.text.split(' ').filter(word => word.startsWith('#')).map(tag => tag.slice(1)))));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(newMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple mock AI response function
  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I'm sorry to hear that you're feeling down. Remember that it's okay to have these feelings. Would you like to talk more about what's causing this, or would you like some suggestions for activities that might help lift your mood?";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
      return "Dealing with stress can be challenging. Let's take a moment to breathe together. Inhale deeply for 4 counts, hold for 4, and exhale for 6. Would it help to talk about what's causing your anxiety?";
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
      return "I'm glad to hear you're doing well! It's important to acknowledge and celebrate positive feelings. Would you like to share what's contributing to your happiness today?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('advice')) {
      return "I'm here to support you. To provide better guidance, could you share more about what you're experiencing or what kind of help you're looking for?";
    } else {
      return "Thank you for sharing. I'm here to listen and support you. Would you like to explore any specific emotions or situations you're dealing with?";
    }
  };

  // Sample resources
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Mindful Breathing Exercise',
      description: '5-minute guided breathing session to reduce stress and anxiety.',
      type: 'exercise',
      icon: <SelfImprovementIcon />,
      tags: ['Stress Relief', 'Focus', 'Relaxation'],
      saved: false
    },
    {
      id: 2,
      title: 'Understanding Your Emotions',
      description: 'Learn about the science of emotions and how they affect your mental state.',
      type: 'article',
      icon: <PsychologyIcon />,
      tags: ['Anxiety', 'School', 'Self-Help'],
      saved: true
    },
    {
      id: 3,
      title: 'Gratitude Journaling',
      description: 'How daily gratitude practice can improve your mental wellbeing.',
      type: 'article',
      icon: <AutoStoriesIcon />,
      tags: ['Mental Health', 'Self-Improvement'],
      saved: false
    },
    {
      id: 4,
      title: 'Managing Exam Stress',
      description: 'Practical techniques to stay calm and perform your best during exams.',
      type: 'video',
      icon: <InsightsIcon />,
      tags: ['Stress Relief', 'Exam Preparation'],
      saved: false
    },
  ];

  // Scroll to bottom of messages when a new one is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredResources(resources);
      return;
    }
    
    setFilteredResources(
      resources.filter(resource => 
        resource.tags.some(tag => selectedTags.includes(tag))
      )
    );
  }, [selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSaveResource = (id: number) => {
    setSavedResources(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const renderChatSection = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 2,
          mb: 2,
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <Typography variant="body1">
          Talk with your AI companion about anything that's on your mind. 
          This is a safe space where you can express your feelings, get support, 
          or simply have a conversation.
        </Typography>
      </Paper>
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          overflow: 'auto',
          height: 400,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.default, 0.5),
          p: 2,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
              animation: message.sender === 'user' ? `${slideInRight} 0.3s ease-out` : `${slideIn} 0.3s ease-out`,
            }}
          >
            {message.sender === 'ai' && (
              <Avatar 
                sx={{ 
                  mr: 1, 
                  bgcolor: theme.palette.primary.main,
                  animation: `${pulse} 2s infinite`,
                  boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}`,
                }}
              >
                <ChatIcon fontSize="small" />
              </Avatar>
            )}
            <Paper
              sx={{
                p: 2,
                maxWidth: '75%',
                borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                bgcolor: message.sender === 'user' 
                  ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  : alpha(theme.palette.background.paper, 0.9),
                color: message.sender === 'user' ? 'white' : 'text.primary',
                boxShadow: message.sender === 'user'
                  ? `0 3px 10px ${alpha(theme.palette.primary.main, 0.3)}`
                  : `0 3px 10px ${alpha(theme.palette.common.black, 0.05)}`,
                position: 'relative',
                '&::after': message.sender === 'ai' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: -8,
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 0 8px 8px',
                  borderColor: `transparent transparent ${alpha(theme.palette.background.paper, 0.9)} transparent`,
                } : undefined,
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  opacity: 0.7 
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
            {message.sender === 'user' && (
              <Avatar 
                sx={{ 
                  ml: 1, 
                  bgcolor: theme.palette.secondary.main,
                }}
              >
                U
              </Avatar>
            )}
          </Box>
        ))}
        
        {isTyping && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 2,
              animation: `${fadeIn} 0.3s ease-out`,
            }}
          >
            <Avatar sx={{ mr: 1, bgcolor: theme.palette.primary.main }}>
              <ChatIcon fontSize="small" />
            </Avatar>
            <Paper
              sx={{
                p: 2,
                borderRadius: '20px 20px 20px 5px',
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                display: 'flex',
                alignItems: 'center',
                width: 100,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>Typing</Typography>
                <CircularProgress size={16} />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
      
      <Box 
        component="form" 
        onSubmit={handleSendMessage} 
        sx={{ 
          display: 'flex',
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              pr: 1,
              transition: 'all 0.2s',
              '&:hover, &.Mui-focused': {
                boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
  
  const renderResourcesSection = () => (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 2,
          mb: 2,
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <Typography variant="body1" paragraph>
          Explore resources to support your emotional wellbeing, academic success, and personal growth.
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mt: 1,
            mb: 0.5,
            animation: `${fadeIn} 0.5s ease-out`,
            animationDelay: '0.1s'
          }}
        >
          {allTags.map((tag) => (
            <Chip 
              key={tag}
              label={tag} 
              color={selectedTags.includes(tag) ? "primary" : "default"}
              onClick={() => handleTagClick(tag)}
              clickable
              sx={{
                borderRadius: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 3px 5px ${alpha(theme.palette.common.black, 0.1)}`,
                }
              }}
            />
          ))}
          
          {selectedTags.length > 0 && (
            <Chip 
              icon={<RefreshIcon fontSize="small" />}
              label="Clear filters" 
              variant="outlined"
              onClick={() => setSelectedTags([])}
              sx={{
                borderRadius: 1.5,
                ml: 1
              }}
            />
          )}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredResources.map((resource, index) => (
          <Box 
            key={resource.id} 
            sx={{ 
              width: { xs: '100%', sm: '48%', md: '31%' },
              animation: `${fadeIn} 0.5s ease-out`,
              animationDelay: `${index * 0.1}s`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 30px -5px ${alpha(theme.palette.primary.main, 0.15)}`,
              }
            }}
            onMouseEnter={() => setHoveredResource(resource.id)}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <Card 
              elevation={hoveredResource === resource.id ? 3 : 1}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => toggleSaveResource(resource.id)}
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(4px)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {savedResources.includes(resource.id) ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Box>
              
              <Box 
                sx={{ 
                  height: 80, 
                  background: resource.type === 'exercise'
                    ? `linear-gradient(45deg, ${alpha(theme.palette.success.light, 0.7)}, ${alpha(theme.palette.success.main, 0.9)})`
                    : resource.type === 'article'
                      ? `linear-gradient(45deg, ${alpha(theme.palette.info.light, 0.7)}, ${alpha(theme.palette.info.main, 0.9)})`
                      : `linear-gradient(45deg, ${alpha(theme.palette.warning.light, 0.7)}, ${alpha(theme.palette.warning.main, 0.9)})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 70%)',
                  }
                }}
              >
                <Typography variant="h5" component="div" fontWeight="bold" sx={{ textAlign: 'center', zIndex: 1 }}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </Typography>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor:
                        resource.type === 'exercise'
                          ? alpha(theme.palette.success.main, 0.1)
                          : resource.type === 'article'
                            ? alpha(theme.palette.info.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                      color:
                        resource.type === 'exercise'
                          ? 'success.main'
                          : resource.type === 'article'
                            ? 'info.main'
                            : 'warning.main',
                      mr: 2,
                    }}
                  >
                    {resource.icon}
                  </Avatar>
                  <Typography variant="h6" component="div" fontWeight="medium">
                    {resource.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {resource.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                  {resource.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color={selectedTags.includes(tag) ? "primary" : "default"}
                      variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                      sx={{ borderRadius: 1, fontSize: '0.7rem', height: 24 }}
                      onClick={() => handleTagClick(tag)}
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  disableElevation
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    bgcolor: resource.type === 'exercise'
                      ? 'success.main'
                      : resource.type === 'article'
                        ? 'info.main'
                        : 'warning.main',
                    '&:hover': {
                      bgcolor: resource.type === 'exercise'
                        ? 'success.dark'
                        : resource.type === 'article'
                          ? 'info.dark'
                          : 'warning.dark',
                    }
                  }}
                >
                  {resource.type === 'exercise' ? 'Start Exercise' : 'Read Article'}
                </Button>
                
                <Tooltip title={savedResources.includes(resource.id) ? "Saved" : "Save for later"}>
                  <Button 
                    size="small" 
                    startIcon={savedResources.includes(resource.id) ? <FavoriteIcon color="error" /> : null}
                    onClick={() => toggleSaveResource(resource.id)}
                    sx={{ ml: 1 }}
                  >
                    {savedResources.includes(resource.id) ? 'Saved' : 'Save'}
                  </Button>
                </Tooltip>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, animation: `${fadeIn} 0.5s ease-out` }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Emotional Support
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Connect with your AI companion for emotional support and access helpful resources.
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          animation: `${fadeIn} 0.5s ease-out`,
          animationDelay: '0.1s'
        }}
      >
        <Button
          variant={activeSection === 'chat' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('chat')}
          startIcon={<ChatIcon />}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: 2,
            boxShadow: activeSection === 'chat' ? 4 : 0,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: activeSection === 'chat' ? 5 : 2,
            }
          }}
        >
          AI Chat
        </Button>
        <Button
          variant={activeSection === 'resources' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('resources')}
          startIcon={<AutoStoriesIcon />}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: 2,
            boxShadow: activeSection === 'resources' ? 4 : 0,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: activeSection === 'resources' ? 5 : 2,
            }
          }}
        >
          Resources
        </Button>
      </Box>
      
      {activeSection === 'chat' ? renderChatSection() : renderResourcesSection()}
    </Container>
  );
};

export default EmotionalSupport; 