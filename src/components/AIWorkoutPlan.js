import React, { useState } from 'react';
import { Box, Typography, Stack, Chip, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';

// Skeleton loader shown while AI is generating
const PlanSkeleton = () => (
  <Box>
    <Typography color="#FF2625" fontWeight={700} fontSize="18px" mb="24px" textAlign="center">
      ⏳ Claude AI is building your plan...
    </Typography>
    {[1, 2, 3].map((i) => (
      <Box
        key={i}
        sx={{
          background: '#f5f5f5',
          borderRadius: '12px',
          height: '80px',
          mb: '12px',
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.4 },
          },
        }}
      />
    ))}
  </Box>
);

// Empty state
const EmptyState = () => (
  <Box
    sx={{
      background: '#fff',
      borderRadius: '16px',
      border: '2px dashed #e0e0e0',
      p: '60px 20px',
      textAlign: 'center',
    }}
  >
    <Typography fontSize="64px" mb="16px">🏋️</Typography>
    <Typography fontWeight={700} fontSize="22px" color="#1a1a1a" mb="8px">
      Your plan will appear here
    </Typography>
    <Typography color="#888" fontSize="15px" maxWidth="360px" mx="auto">
      Fill in your details on the left and hit <strong>"Generate My Workout Plan"</strong> to get a personalised weekly programme built by AI.
    </Typography>
  </Box>
);

// Single exercise row inside a day
const ExerciseRow = ({ exercise, index }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { lg: '2fr 1fr 1fr 1fr', xs: '1fr 1fr' },
      gap: '8px',
      py: '12px',
      borderBottom: '1px solid #f5f5f5',
      '&:last-child': { borderBottom: 'none' },
      alignItems: 'start',
    }}
  >
    <Box>
      <Typography fontWeight={600} fontSize="14px" color="#1a1a1a" textTransform="capitalize">
        {index + 1}. {exercise.name}
      </Typography>
      {exercise.tips && (
        <Typography fontSize="12px" color="#888" mt="2px">
          💡 {exercise.tips}
        </Typography>
      )}
    </Box>
    <Box textAlign="center">
      <Typography fontSize="11px" color="#999" fontWeight={600} textTransform="uppercase">Sets</Typography>
      <Typography fontWeight={700} color="#FF2625">{exercise.sets}</Typography>
    </Box>
    <Box textAlign="center">
      <Typography fontSize="11px" color="#999" fontWeight={600} textTransform="uppercase">Reps</Typography>
      <Typography fontWeight={700} color="#1a1a1a">{exercise.reps}</Typography>
    </Box>
    <Box textAlign="center">
      <Typography fontSize="11px" color="#999" fontWeight={600} textTransform="uppercase">Rest</Typography>
      <Typography fontWeight={700} color="#1a1a1a">{exercise.rest}</Typography>
    </Box>
  </Box>
);

// Day card (accordion)
const DayCard = ({ dayPlan, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  const focusColors = [
    '#FF2625', '#e07000', '#0066cc', '#00885a', '#7a00cc', '#cc0055',
  ];
  const color = focusColors[index % focusColors.length];

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        borderRadius: '12px !important',
        border: `1px solid ${color}22`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        mb: '12px',
        '&:before': { display: 'none' },
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        sx={{
          background: `linear-gradient(135deg, ${color}10, ${color}05)`,
          borderBottom: expanded ? `2px solid ${color}30` : 'none',
          minHeight: '64px',
        }}
      >
        <Stack direction="row" alignItems="center" gap="16px" width="100%">
          <Box
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {index + 1}
          </Box>
          <Box flex={1}>
            <Typography fontWeight={700} fontSize="16px" color="#1a1a1a">
              {dayPlan.day}
            </Typography>
            <Typography fontSize="13px" color="#666">
              {dayPlan.focus}
            </Typography>
          </Box>
          <Chip
            label={`${dayPlan.exercises?.length || 0} exercises`}
            size="small"
            sx={{ background: `${color}15`, color: color, fontWeight: 600, fontSize: '12px' }}
          />
          <Typography fontSize="18px" sx={{ ml: '4px', color: '#999', transition: '0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▾
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: '20px 24px', background: '#fff' }}>
        {/* Warmup */}
        {dayPlan.warmup && (
          <Box
            sx={{
              background: '#fff8e6',
              border: '1px solid #ffe0a0',
              borderRadius: '8px',
              p: '12px 16px',
              mb: '16px',
            }}
          >
            <Typography fontSize="12px" fontWeight={700} color="#e07000" textTransform="uppercase" letterSpacing="1px" mb="4px">
              🔥 Warmup
            </Typography>
            <Typography fontSize="13px" color="#555">{dayPlan.warmup}</Typography>
          </Box>
        )}

        {/* Exercise table header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { lg: '2fr 1fr 1fr 1fr', xs: '1fr 1fr' },
            gap: '8px',
            pb: '8px',
            borderBottom: '2px solid #f0f0f0',
            mb: '4px',
          }}
        >
          <Typography fontSize="11px" fontWeight={700} color="#999" textTransform="uppercase">Exercise</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#999" textTransform="uppercase" textAlign="center">Sets</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#999" textTransform="uppercase" textAlign="center">Reps</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#999" textTransform="uppercase" textAlign="center">Rest</Typography>
        </Box>

        {/* Exercises */}
        {dayPlan.exercises?.map((ex, i) => (
          <ExerciseRow key={i} exercise={ex} index={i} />
        ))}

        {/* Cooldown */}
        {dayPlan.cooldown && (
          <Box
            sx={{
              background: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '8px',
              p: '12px 16px',
              mt: '16px',
            }}
          >
            <Typography fontSize="12px" fontWeight={700} color="#2e7d32" textTransform="uppercase" letterSpacing="1px" mb="4px">
              ❄️ Cooldown
            </Typography>
            <Typography fontSize="13px" color="#555">{dayPlan.cooldown}</Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// Main component
const AIWorkoutPlan = ({ workoutPlan, loading, formData }) => {
  const handlePrint = () => window.print();

  if (loading) return <PlanSkeleton />;
  if (!workoutPlan) return <EmptyState />;

  const { weeklyPlan, weeklyTips, estimatedCaloriesPerSession, totalWeeklyDuration } = workoutPlan;

  return (
    <Box>
      {/* Plan header */}
      <Box
        sx={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          p: '24px 28px',
          mb: '20px',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="12px">
          <Box>
            <Stack direction="row" alignItems="center" gap="10px" mb="6px">
              <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF2625' }} />
              <Typography fontSize="12px" fontWeight={700} color="#FF2625" textTransform="uppercase" letterSpacing="1.5px">
                AI Generated Plan
              </Typography>
            </Stack>
            <Typography fontWeight={800} fontSize="22px" color="#1a1a1a">
              Your {weeklyPlan?.length}-Day Weekly Programme
            </Typography>
            {formData && (
              <Typography fontSize="13px" color="#888" mt="4px">
                {formData.goal} · {formData.level} · {formData.days} days/week
              </Typography>
            )}
          </Box>
          <Button
            onClick={handlePrint}
            variant="outlined"
            sx={{
              borderColor: '#e0e0e0',
              color: '#555',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#FF2625', color: '#FF2625' },
            }}
          >
            🖨 Print Plan
          </Button>
        </Stack>

        {/* Stats row */}
        <Stack direction="row" gap="24px" mt="20px" flexWrap="wrap">
          <Box>
            <Typography fontSize="12px" color="#999" fontWeight={600} textTransform="uppercase">Days/Week</Typography>
            <Typography fontWeight={800} fontSize="22px" color="#FF2625">{weeklyPlan?.length}</Typography>
          </Box>
          {estimatedCaloriesPerSession && (
            <Box>
              <Typography fontSize="12px" color="#999" fontWeight={600} textTransform="uppercase">Cal / Session</Typography>
              <Typography fontWeight={800} fontSize="22px" color="#1a1a1a">{estimatedCaloriesPerSession}</Typography>
            </Box>
          )}
          {totalWeeklyDuration && (
            <Box>
              <Typography fontSize="12px" color="#999" fontWeight={600} textTransform="uppercase">Total / Week</Typography>
              <Typography fontWeight={800} fontSize="22px" color="#1a1a1a">{totalWeeklyDuration}</Typography>
            </Box>
          )}
          {formData?.equipment && (
            <Box>
              <Typography fontSize="12px" color="#999" fontWeight={600} textTransform="uppercase">Equipment</Typography>
              <Typography fontWeight={700} fontSize="14px" color="#1a1a1a">{formData.equipment.join(', ')}</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Day-by-day plan */}
      <Box mb="20px">
        {weeklyPlan?.map((dayPlan, i) => (
          <DayCard key={i} dayPlan={dayPlan} index={i} />
        ))}
      </Box>

      {/* Weekly tips */}
      {weeklyTips?.length > 0 && (
        <Box
          sx={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            p: '24px 28px',
          }}
        >
          <Typography fontWeight={700} fontSize="18px" color="#1a1a1a" mb="16px">
            💡 Weekly Training Tips
          </Typography>
          <Stack gap="12px">
            {weeklyTips.map((tip, i) => (
              <Stack key={i} direction="row" gap="12px" alignItems="flex-start">
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#FF2625',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  {i + 1}
                </Box>
                <Typography fontSize="14px" color="#555" lineHeight="1.6">{tip}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AIWorkoutPlan;