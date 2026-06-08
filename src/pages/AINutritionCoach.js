import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import NutritionForm from '../components/NutritionForm';
import NutritionPlan from '../components/NutritionPlan';

const AINutritionCoach = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  return (
    <Box sx={{ mb: '80px' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #000d00 0%, #002a00 40%, #001a00 100%)',
          py: { lg: '64px', xs: '40px' },
          px: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background watermark */}
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { lg: '200px', xs: '80px' },
            fontWeight: 900,
            color: 'rgba(46,125,50,0.06)',
            letterSpacing: '-12px',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          EAT
        </Typography>

        <Stack alignItems="center" gap="16px" position="relative" zIndex={1}>
          <Box
            sx={{
              background: '#2e7d32',
              color: '#fff',
              px: '18px',
              py: '5px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            🥗 Powered by Claude AI
          </Box>
          <Typography
            fontWeight={900}
            color="#fff"
            sx={{ fontSize: { lg: '56px', xs: '32px' }, lineHeight: 1.05, letterSpacing: '-1px' }}
          >
            AI Nutrition<br />
            <Box component="span" sx={{ color: '#4caf50' }}>Coach</Box>
          </Typography>
          <Typography
            color="rgba(255,255,255,0.55)"
            sx={{ fontSize: { lg: '18px', xs: '14px' }, maxWidth: '580px', lineHeight: 1.6 }}
          >
            Share your body stats, dietary preferences, and health goals — get a
            complete daily meal plan with macros and shopping list.
          </Typography>

          {/* Feature badges */}
          <Stack direction="row" gap="10px" flexWrap="wrap" justifyContent="center" mt="8px">
            {['Daily Meal Plan', 'Macro Breakdown', 'Calorie Targets', 'Shopping List', 'Dietary Restrictions'].map((badge) => (
              <Box
                key={badge}
                sx={{
                  background: 'rgba(46,125,50,0.2)',
                  border: '1px solid rgba(46,125,50,0.4)',
                  color: '#80c883',
                  px: '12px',
                  py: '4px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ✓ {badge}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Main layout */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { lg: '32px', xs: '16px' }, mt: '48px' }}>
        <Stack
          sx={{
            flexDirection: { lg: 'row' },
            gap: { lg: '40px', xs: '32px' },
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: '0 0 auto', width: { lg: '380px', xs: '100%' } }}>
            <NutritionForm
              setPlan={setPlan}
              setLoading={setLoading}
              loading={loading}
              setFormData={setFormData}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <NutritionPlan plan={plan} loading={loading} formData={formData} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AINutritionCoach;