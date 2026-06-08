import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AIWorkoutForm from '../components/AIWorkoutForm';
import AIWorkoutPlan from '../components/AIWorkoutPlan';

const AIWorkout = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  return (
    <Box sx={{ mt: { lg: '96px', xs: '60px' }, mb: '80px' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a0000 0%, #3a0000 50%, #1a0000 100%)',
          py: { lg: '60px', xs: '40px' },
          px: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative bg text */}
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { lg: '180px', xs: '80px' },
            fontWeight: 900,
            color: 'rgba(255,38,37,0.06)',
            letterSpacing: '-10px',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          AI GYM
        </Typography>

        <Stack alignItems="center" gap="12px" position="relative">
          <Box
            sx={{
              background: '#FF2625',
              color: '#fff',
              px: '16px',
              py: '4px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            Powered by Claude AI
          </Box>
          <Typography
            fontWeight={800}
            color="#fff"
            sx={{ fontSize: { lg: '52px', xs: '30px' }, lineHeight: 1.1 }}
          >
            Your Personal<br />
            <span style={{ color: '#FF2625' }}>AI Workout Generator</span>
          </Typography>
          <Typography
            color="rgba(255,255,255,0.6)"
            sx={{ fontSize: { lg: '18px', xs: '14px' }, maxWidth: '600px' }}
          >
            Tell us your goal, fitness level, and available equipment — and get
            a complete weekly workout plan built just for you.
          </Typography>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: '20px', mt: '48px' }}>
        <Stack
          sx={{
            flexDirection: { lg: 'row' },
            gap: { lg: '40px', xs: '32px' },
            alignItems: 'flex-start',
          }}
        >
          {/* Left — form */}
          <Box sx={{ flex: '0 0 auto', width: { lg: '380px', xs: '100%' } }}>
            <AIWorkoutForm
              setWorkoutPlan={setWorkoutPlan}
              setLoading={setLoading}
              loading={loading}
              setFormData={setFormData}
            />
          </Box>

          {/* Right — plan output */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AIWorkoutPlan
              workoutPlan={workoutPlan}
              loading={loading}
              formData={formData}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AIWorkout;