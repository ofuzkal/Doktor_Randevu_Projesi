import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip 
      title={mode === 'light' ? 'Karanlık temaya geç' : 'Açık temaya geç'} 
      arrow
      placement="bottom"
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size="medium"
        sx={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'rotate(180deg)',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        }}
      >
        {mode === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher; 