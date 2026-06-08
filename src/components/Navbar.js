import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import Logo from '../assets/images/Logo.png';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkBase = {
    textDecoration: 'none',
    fontFamily: 'Alegreya',
    fontSize: '22px',
    fontWeight: 600,
    transition: '0.2s all',
    paddingBottom: '4px',
    whiteSpace: 'nowrap',
  };

  const activeStyle = {
    ...linkBase,
    color: '#FF2625',
    borderBottom: '3px solid #FF2625',
  };

  const normalStyle = {
    ...linkBase,
    color: '#3A1212',
    borderBottom: '3px solid transparent',
  };

  const aiExerciseStyle = {
    ...linkBase,
    color: isActive('/ai-exercise-buddy') ? '#fff' : '#FF2625',
    background: isActive('/ai-exercise-buddy')
      ? '#FF2625'
      : 'linear-gradient(135deg, #fff0f0, #ffe0e0)',
    border: '2px solid #FF2625',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '17px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const aiNutritionStyle = {
    ...linkBase,
    color: isActive('/ai-nutrition-coach') ? '#fff' : '#2e7d32',
    background: isActive('/ai-nutrition-coach')
      ? '#2e7d32'
      : 'linear-gradient(135deg, #f0fff0, #e0ffe0)',
    border: '2px solid #2e7d32',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '17px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255,250,251,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f0e0e0',
        px: { lg: '40px', xs: '16px' },
        py: { lg: '0px', xs: '12px' },
      }}
    >
      {/* Desktop nav */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ display: { xs: 'none', md: 'flex' }, minHeight: '72px' }}
      >
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Gold's Gym" style={{ width: '52px', height: '52px' }} />
        </Link>

        {/* Nav links */}
        <Stack direction="row" alignItems="center" gap="28px">
          <Link to="/" style={isActive('/') ? activeStyle : normalStyle}>
            Home
          </Link>
          <a href="/#exercises" style={normalStyle}>
            Exercises
          </a>

          {/* AI divider label */}
          <Box
            sx={{
              fontSize: '10px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              color: '#bbb',
              textTransform: 'uppercase',
              borderLeft: '1px solid #e0e0e0',
              pl: '24px',
            }}
          >
            AI Tools
          </Box>

          <Link to="/ai-exercise-buddy" style={aiExerciseStyle}>
            💪 AI Exercise Buddy
          </Link>
          <Link to="/ai-nutrition-coach" style={aiNutritionStyle}>
            🥗 AI Nutrition Coach
          </Link>
        </Stack>
      </Stack>

      {/* Mobile nav */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <Link to="/">
          <img src={Logo} alt="Gold's Gym" style={{ width: '40px', height: '40px' }} />
        </Link>
        <Box
          onClick={() => setMenuOpen(!menuOpen)}
          sx={{ cursor: 'pointer', fontSize: '26px', color: '#FF2625', lineHeight: 1 }}
        >
          {menuOpen ? '✕' : '☰'}
        </Box>
      </Stack>

      {/* Mobile dropdown */}
      {menuOpen && (
        <Stack
          gap="16px"
          sx={{
            display: { xs: 'flex', md: 'none' },
            pt: '16px',
            pb: '20px',
            borderTop: '1px solid #f0e0e0',
            mt: '12px',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/" style={isActive('/') ? activeStyle : normalStyle}>Home</Link>
          <a href="/#exercises" style={normalStyle}>Exercises</a>
          <Link to="/ai-exercise-buddy" style={{ ...aiExerciseStyle, display: 'inline-flex', width: 'fit-content' }}>
            💪 AI Exercise Buddy
          </Link>
          <Link to="/ai-nutrition-coach" style={{ ...aiNutritionStyle, display: 'inline-flex', width: 'fit-content' }}>
            🥗 AI Nutrition Coach
          </Link>
        </Stack>
      )}
    </Box>
  );
};

export default Navbar;