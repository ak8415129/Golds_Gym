import React, { useState } from 'react';
import { Box, Typography, Stack, Chip, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';

const ACCENT = '#FF2625';
const DAY_COLORS = ['#FF2625', '#e07000', '#0066cc', '#7a00cc', '#00885a', '#cc0055', '#0099aa'];

// ── Skeleton ──────────────────────────────────────────────────
const Skeleton = () => (
  <Box>
    <Stack alignItems="center" gap="12px" mb="32px">
      <Typography fontSize="40px">⚙️</Typography>
      <Typography fontWeight={700} fontSize="18px" color={ACCENT}>Building your personalised plan...</Typography>
      <Typography color="#888" fontSize="14px">Claude AI is crafting every set, rep, and rest period for you</Typography>
    </Stack>
    {[1, 2, 3, 4].map((i) => (
      <Box key={i} sx={{
        background: '#f5f5f5', borderRadius: '12px', height: '72px', mb: '10px',
        animation: 'pulse 1.4s ease-in-out infinite',
        '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } },
        animationDelay: `${i * 0.15}s`,
      }} />
    ))}
  </Box>
);

// ── Empty state ───────────────────────────────────────────────
const Empty = () => (
  <Box sx={{ background: '#fff', borderRadius: '16px', border: '2px dashed #f0e0e0', p: '64px 24px', textAlign: 'center' }}>
    <Typography fontSize="72px" mb="16px">🏋️</Typography>
    <Typography fontWeight={800} fontSize="24px" color="#1a1a1a" mb="8px">Your Exercise Plan Appears Here</Typography>
    <Typography color="#999" fontSize="15px" maxWidth="380px" mx="auto" lineHeight={1.7}>
      Fill in your profile on the left and click <strong>"Generate My Exercise Plan"</strong> to get a personalised weekly programme.
    </Typography>
  </Box>
);

// ── Single exercise row ───────────────────────────────────────
const ExRow = ({ ex, i }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { lg: '2.5fr 1fr 1fr 1fr', xs: '2fr 1fr' },
    gap: '8px', py: '12px',
    borderBottom: '1px solid #fafafa',
    '&:last-child': { borderBottom: 'none' },
    alignItems: 'start',
  }}>
    <Box>
      <Typography fontWeight={600} fontSize="14px" color="#1a1a1a" textTransform="capitalize">
        {i + 1}. {ex.name}
      </Typography>
      {ex.tips && <Typography fontSize="12px" color="#888" mt="3px">💡 {ex.tips}</Typography>}
    </Box>
    <Box textAlign="center">
      <Typography fontSize="10px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Sets</Typography>
      <Typography fontWeight={800} fontSize="15px" color={ACCENT}>{ex.sets}</Typography>
    </Box>
    <Box textAlign="center">
      <Typography fontSize="10px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Reps</Typography>
      <Typography fontWeight={700} fontSize="14px" color="#1a1a1a">{ex.reps}</Typography>
    </Box>
    <Box textAlign="center">
      <Typography fontSize="10px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Rest</Typography>
      <Typography fontWeight={700} fontSize="14px" color="#555">{ex.rest}</Typography>
    </Box>
  </Box>
);

// ── Day accordion card ────────────────────────────────────────
const DayCard = ({ dayPlan, idx }) => {
  const [open, setOpen] = useState(idx === 0);
  const color = DAY_COLORS[idx % DAY_COLORS.length];

  return (
    <Accordion expanded={open} onChange={() => setOpen(!open)} sx={{
      borderRadius: '12px !important', border: `1px solid ${color}25`,
      boxShadow: '0 2px 16px rgba(0,0,0,0.05)', mb: '10px',
      '&:before': { display: 'none' }, overflow: 'hidden',
    }}>
      <AccordionSummary sx={{
        background: `linear-gradient(135deg, ${color}12, ${color}05)`,
        borderBottom: open ? `1px solid ${color}25` : 'none',
        minHeight: '68px', px: '20px',
      }}>
        <Stack direction="row" alignItems="center" gap="14px" width="100%">
          <Box sx={{
            width: '42px', height: '42px', borderRadius: '10px', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '15px', flexShrink: 0,
          }}>{idx + 1}</Box>
          <Box flex={1} minWidth={0}>
            <Typography fontWeight={700} fontSize="15px" color="#1a1a1a" noWrap>{dayPlan.day}</Typography>
            <Typography fontSize="13px" color="#777">{dayPlan.focus}{dayPlan.duration ? ` · ${dayPlan.duration}` : ''}</Typography>
          </Box>
          <Chip label={`${dayPlan.exercises?.length || 0} exercises`} size="small"
            sx={{ background: `${color}18`, color, fontWeight: 700, fontSize: '11px', flexShrink: 0 }} />
          <Typography sx={{ color: '#bbb', fontSize: '16px', transform: open ? 'rotate(180deg)' : 'none', transition: '0.25s' }}>▾</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: '20px 24px', background: '#fff' }}>
        {dayPlan.warmup && (
          <Box sx={{ background: '#fff8e6', border: '1px solid #ffe0a0', borderRadius: '8px', p: '12px 16px', mb: '16px' }}>
            <Typography fontSize="11px" fontWeight={700} color="#e07000" textTransform="uppercase" letterSpacing="1.5px" mb="4px">🔥 Warm-up</Typography>
            <Typography fontSize="13px" color="#555" lineHeight={1.6}>{dayPlan.warmup}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '2.5fr 1fr 1fr 1fr', xs: '2fr 1fr' }, gap: '8px', pb: '10px', borderBottom: '2px solid #f5f5f5', mb: '4px' }}>
          <Typography fontSize="11px" fontWeight={700} color="#ccc" textTransform="uppercase">Exercise</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#ccc" textTransform="uppercase" textAlign="center">Sets</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#ccc" textTransform="uppercase" textAlign="center">Reps</Typography>
          <Typography fontSize="11px" fontWeight={700} color="#ccc" textTransform="uppercase" textAlign="center">Rest</Typography>
        </Box>

        {dayPlan.exercises?.map((ex, i) => <ExRow key={i} ex={ex} i={i} />)}

        {dayPlan.cooldown && (
          <Box sx={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', p: '12px 16px', mt: '16px' }}>
            <Typography fontSize="11px" fontWeight={700} color="#2e7d32" textTransform="uppercase" letterSpacing="1.5px" mb="4px">❄️ Cool-down</Typography>
            <Typography fontSize="13px" color="#555" lineHeight={1.6}>{dayPlan.cooldown}</Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// ── Main component ────────────────────────────────────────────
const ExercisePlan = ({ plan, loading, formData }) => {
  if (loading) return <Skeleton />;
  if (!plan) return <Empty />;

  const { weeklyPlan, weeklyTips, progressionTips, estimatedCaloriesPerSession, totalWeeklyDuration } = plan;

  return (
    <Box>
      {/* Header card */}
      <Box sx={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e0e0', boxShadow: '0 4px 24px rgba(255,38,37,0.05)', p: '24px 28px', mb: '20px' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap="12px">
          <Box>
            <Stack direction="row" alignItems="center" gap="8px" mb="6px">
              <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT }} />
              <Typography fontSize="11px" fontWeight={700} color={ACCENT} textTransform="uppercase" letterSpacing="2px">AI Exercise Plan</Typography>
            </Stack>
            <Typography fontWeight={800} fontSize="22px" color="#1a1a1a">
              Your {weeklyPlan?.length}-Day Weekly Programme
            </Typography>
            {formData && (
              <Typography fontSize="13px" color="#999" mt="4px">
                {formData.goal} · {formData.level?.split(' ')[0]} · {formData.days} days/week
                {formData.focusArea ? ` · ${formData.focusArea}` : ''}
              </Typography>
            )}
          </Box>
          <Button onClick={() => window.print()} variant="outlined" sx={{
            borderColor: '#e0e0e0', color: '#777', borderRadius: '8px',
            textTransform: 'none', fontWeight: 600, fontSize: '13px',
            '&:hover': { borderColor: ACCENT, color: ACCENT, background: '#fff0f0' },
          }}>🖨 Print Plan</Button>
        </Stack>

        {/* Stats */}
        <Stack direction="row" gap="32px" mt="20px" flexWrap="wrap">
          <Box>
            <Typography fontSize="11px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Days/Week</Typography>
            <Typography fontWeight={900} fontSize="24px" color={ACCENT}>{weeklyPlan?.length}</Typography>
          </Box>
          {estimatedCaloriesPerSession && (
            <Box>
              <Typography fontSize="11px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Cal/Session</Typography>
              <Typography fontWeight={900} fontSize="24px" color="#1a1a1a">{estimatedCaloriesPerSession}</Typography>
            </Box>
          )}
          {totalWeeklyDuration && (
            <Box>
              <Typography fontSize="11px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Total/Week</Typography>
              <Typography fontWeight={900} fontSize="24px" color="#1a1a1a">{totalWeeklyDuration}</Typography>
            </Box>
          )}
          {formData?.equipment && (
            <Box>
              <Typography fontSize="11px" color="#bbb" fontWeight={700} textTransform="uppercase" letterSpacing="0.5px">Equipment</Typography>
              <Typography fontWeight={600} fontSize="13px" color="#555" mt="4px">{formData.equipment.join(' · ')}</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Days */}
      <Box mb="20px">
        {weeklyPlan?.map((day, i) => <DayCard key={i} dayPlan={day} idx={i} />)}
      </Box>

      {/* Progression tips */}
      {progressionTips?.length > 0 && (
        <Box sx={{ background: '#fff5f5', border: '1px solid #ffe0e0', borderRadius: '16px', p: '24px 28px', mb: '16px' }}>
          <Typography fontWeight={800} fontSize="17px" color="#1a1a1a" mb="16px">📈 Progression Tips</Typography>
          <Stack gap="10px">
            {progressionTips.map((tip, i) => (
              <Stack key={i} direction="row" gap="12px" alignItems="flex-start">
                <Box sx={{ width: '22px', height: '22px', borderRadius: '50%', background: ACCENT, color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '1px' }}>{i + 1}</Box>
                <Typography fontSize="14px" color="#555" lineHeight={1.6}>{tip}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {/* Weekly tips */}
      {weeklyTips?.length > 0 && (
        <Box sx={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', p: '24px 28px' }}>
          <Typography fontWeight={800} fontSize="17px" color="#1a1a1a" mb="16px">💡 Weekly Training Tips</Typography>
          <Stack gap="10px">
            {weeklyTips.map((tip, i) => (
              <Stack key={i} direction="row" gap="12px" alignItems="flex-start">
                <Typography fontSize="16px" flexShrink={0}>✓</Typography>
                <Typography fontSize="14px" color="#555" lineHeight={1.6}>{tip}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ExercisePlan;