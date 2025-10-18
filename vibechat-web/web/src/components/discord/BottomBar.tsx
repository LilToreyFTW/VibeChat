import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  EmojiEmotions as EmojiIcon,
  Gif as GifIcon,
  Mic as MicIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface BottomBarProps {
  selectedChannel: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ selectedChannel }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send the message via WebSocket/API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        p: 2,
      }}
    >
      {/* Input Area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          backgroundColor: 'background.default',
          borderRadius: '8px',
          p: 1,
        }}
      >
        {/* Attachment Button */}
        <Tooltip title="Add Attachment">
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'text.primary',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Message Input */}
        <TextField
          multiline
          maxRows={4}
          placeholder={`Message #${selectedChannel}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'transparent',
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
              fontSize: '0.875rem',
              lineHeight: 1.4,
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.8,
              },
            },
          }}
          variant="outlined"
        />

        {/* Emoji Button */}
        <Tooltip title="Open Emoji Picker">
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'text.primary',
              },
            }}
          >
            <EmojiIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* GIF Button */}
        <Tooltip title="Search GIFs">
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'text.primary',
              },
            }}
          >
            <GifIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Voice Message or Send Button */}
        {message.trim() ? (
          <Tooltip title="Send Message">
            <IconButton
              onClick={handleSendMessage}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                width: 36,
                height: 36,
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Voice Message">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'text.primary',
                },
              }}
            >
              <MicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Typing Indicator or Quick Actions */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {isTyping && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Someone is typing...
            </Typography>
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BottomBar;
