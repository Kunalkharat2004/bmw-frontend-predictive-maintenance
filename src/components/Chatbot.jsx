/**
 * Chatbot Component - AutoCare AI Vehicle Health Assistant
 * Simple floating chat panel for Q&A about vehicle health
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Avatar,
  Slide,
  Grow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { initializeChatbot, sendChatMessage } from '../services/api';

const CHATBOT_NAME = 'AutoCare AI';

const Chatbot = ({ prediction, pdfUrl, isReady }) => {
  const { isDark } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isOpen, setIsOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Colors
  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    headerBg: isDark ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    userBubble: isDark ? '#3b82f6' : '#3b82f6',
    botBubble: isDark ? '#1e293b' : '#f1f5f9',
    botText: isDark ? '#e2e8f0' : '#334155',
    inputBg: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chatbot when opened and ready
  useEffect(() => {
    if (isOpen && isReady && prediction && !isInitialized && !isInitializing) {
      initializeChat();
    }
  }, [isOpen, isReady, prediction, isInitialized]);

  const initializeChat = async () => {
    setIsInitializing(true);
    try {
      const result = await initializeChatbot(prediction, pdfUrl);
      if (result.success) {
        setMessages([{
          role: 'bot',
          content: result.greeting || `Hello! I'm ${CHATBOT_NAME}, your vehicle health assistant. How can I help you today?`
        }]);
        setIsInitialized(true);
      } else {
        setMessages([{
          role: 'bot',
          content: `Hello! I'm ${CHATBOT_NAME}. I'm having trouble loading the analysis data, but I'll try to help you.`
        }]);
      }
    } catch (error) {
      console.error('Chat init error:', error);
      setMessages([{
        role: 'bot',
        content: `Hello! I'm ${CHATBOT_NAME}. I encountered an issue, but feel free to ask me questions!`
      }]);
    }
    setIsInitializing(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSending(true);
    
    try {
      const result = await sendChatMessage(userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: result.success ? result.response : 'Sorry, I had trouble processing that. Please try again.'
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
    
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => setIsOpen(prev => !prev);

  if (!isReady) return null;

  return (
    <>
      {/* Floating Chat Panel - positioned above the FAB */}
      <Grow 
        in={isOpen} 
        unmountOnExit 
        timeout={{ enter: 250, exit: 200 }}
        style={{ transformOrigin: 'bottom right' }}
      >
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: isMobile ? 'calc(100vw - 48px)' : 380,
            maxWidth: 380,
            height: 480,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
            zIndex: 1000
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: colors.headerBg,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <BotIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {CHATBOT_NAME}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                  Vehicle Health Assistant
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleToggle} size="small" sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            {/* Loading State */}
            {isInitializing && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress size={28} />
                <Typography variant="body2" sx={{ ml: 2, color: colors.botText, fontSize: '0.85rem' }}>
                  Analyzing data...
                </Typography>
              </Box>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 0.75
                }}
              >
                {msg.role === 'bot' && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#8b5cf6' }}>
                    <BotIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    py: 1,
                    px: 1.5,
                    maxWidth: '85%',
                    borderRadius: 2,
                    bgcolor: msg.role === 'user' ? colors.userBubble : colors.botBubble,
                    color: msg.role === 'user' ? '#fff' : colors.botText
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, fontSize: '0.85rem' }}>
                    {msg.content}
                  </Typography>
                </Paper>
                {msg.role === 'user' && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#10b981' }}>
                    <UserIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#8b5cf6' }}>
                  <BotIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper elevation={0} sx={{ py: 1, px: 1.5, bgcolor: colors.botBubble, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94a3b8', animation: 'chatPulse 1s infinite' }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94a3b8', animation: 'chatPulse 1s infinite 0.2s' }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94a3b8', animation: 'chatPulse 1s infinite 0.4s' }} />
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: `1px solid ${colors.border}`,
              bgcolor: colors.inputBg
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                size="small"
                placeholder="Ask about your vehicle..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending || isInitializing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#fff',
                    borderRadius: 2,
                    fontSize: '0.875rem'
                  }
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending || isInitializing}
                sx={{
                  bgcolor: '#3b82f6',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: '#2563eb' },
                  '&:disabled': { bgcolor: isDark ? '#334155' : '#e2e8f0', color: '#94a3b8' }
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Grow>

      {/* Floating Chat Button - ALWAYS fixed at bottom-right */}
      <Fab
        color="primary"
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1001,
          background: isOpen 
            ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' 
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          '&:hover': {
            background: isOpen 
              ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)' 
              : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
        }}
      >
        {isOpen ? <CloseIcon /> : <BotIcon />}
      </Fab>

      {/* CSS Keyframes for typing animation */}
      <style>
        {`
          @keyframes chatPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
