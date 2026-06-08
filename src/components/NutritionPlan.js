import React, { useState } from 'react';
import { Box, Typography, Stack, Button, Chip } from '@mui/material';

const GREEN = '#2e7d32';
const MEAL_COLORS = ['#e07000', '#2e7d32', '#FF2625', '#0066cc', '#7a00cc', '#00885a'];

// ── Skeleton ──────────────────────────────────────────────────
const Skeleton = () => (
  <Box>
    <Stack alignItems="center" gap="12px" mb="32px">
      <Typography fontSize="40px">🧬</Typography>
      <Typography fontWeight={700} fontSize="18px" color={GREEN}>Calculating your nutrition plan...</Typography>
      <Typography color="#888" fontSize="14px">Claude AI is working out your macros, meals, and shopping list</Typography>
    </Stack>
    {[1, 2, 3, 4, 5].map((i) => (
      <Box key={i} sx={{
        background: '#f5f5f5', borderRadius: '12px', height: '68px', mb: '10px',
        animation: 'pulse 1.4s ease-in-out infinite',
        '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } },
        animationDelay: `${i * 0.12}s`,
      }} />
    ))}
  </Box>
);

// ── Empty state ───────────────────────────────────────────────
const Empty = () => (
  <Box sx={{ background: '#fff', borderRadius: '16px', border: '2px dashed #c8e6c9', p: '64px 24px', textAlign: 'center' }}>
    <Typography fontSize="72px" mb="16px">🥦</Typography>
    <Typography fontWeight={800} fontSize="24px" color="#1a1a1a" mb="8px">Your Nutrition Plan Appears Here</Typography>
    <Typography color="#999" fontSize="15px" maxWidth="380px" mx="auto" lineHeight={1.7}>
      Fill in your profile on the left and click <strong>"Generate My Nutrition Plan"</strong> to get a personalised daily meal plan with full macros.
    </Typography>
  </Box>
);

// ── Macro pill ────────────────────────────────────────────────
const MacroPill = ({ label, value, color }) => (
  <Box sx={{ textAlign: 'center', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: '12px', px: '16px', py: '12px', minWidth: '80px' }}>
    <Typography fontSize="10px" fontWeight={700} color={color} textTransform="uppercase" letterSpacing="1px">{label}</Typography>
    <Typography fontWeight={800} fontSize="18px" color="#1a1a1a" mt="2px">{value}</Typography>
  </Box>
);

// ── Food item row inside a meal ───────────────────────────────
const FoodItem = ({ item, accent }) => (
  <Box sx={{ py: '12px', borderBottom: '1px solid #fafafa', '&:last-child': { borderBottom: 'none' } }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap="12px" flexWrap="wrap">
      <Box flex={1}>
        <Typography fontWeight={600} fontSize="14px" color="#1a1a1a">{item.food}</Typography>
        <Typography fontSize="12px" color="#999" mt="2px">{item.amount}</Typography>
        {item.notes && <Typography fontSize="12px" color="#888" mt="3px" fontStyle="italic">💡 {item.notes}</Typography>}
      </Box>
      <Stack direction="row" gap="8px" flexShrink={0} flexWrap="wrap">
        {item.protein && <Chip label={`P: ${item.protein}`} size="small" sx={{ background: '#fff0e0', color: '#e07000', fontWeight: 700, fontSize: '11px' }} />}
        {item.carbs && <Chip label={`C: ${item.carbs}`} size="small" sx={{ background: '#e8f5e9', color: GREEN, fontWeight: 700, fontSize: '11px' }} />}
        {item.fats && <Chip label={`F: ${item.fats}`} size="small" sx={{ background: '#e3f2fd', color: '#0066cc', fontWeight: 700, fontSize: '11px' }} />}
      </Stack>
    </Stack>
  </Box>
);

// ── Meal card ─────────────────────────────────────────────────
const MealCard = ({ meal, idx }) => {
  const [open, setOpen] = useState(idx === 0);
  const color = MEAL_COLORS[idx % MEAL_COLORS.length];

  return (
    <Box sx={{ background: '#fff', borderRadius: '14px', border: `1px solid ${color}20`, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', mb: '12px', overflow: 'hidden' }}>
      {/* Meal header */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', p: '16px 20px', background: `linear-gradient(135deg, ${color}10, ${color}05)`, borderBottom: open ? `1px solid ${color}20` : 'none' }}
      >
        <Stack direction="row" alignItems="center" gap="14px">
          <Box sx={{ width: '40px', height: '40px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
            {['🌅', '🥪', '🍌', '🍽️', '🌙'][idx] || '🍴'}
          </Box>
          <Box flex={1}>
            <Typography fontWeight={700} fontSize="15px" color="#1a1a1a">{meal.name}</Typography>
            <Typography fontSize="12px" color="#999">{meal.time}{meal.calories ? ` · ~${meal.calories} kcal` : ''}</Typography>
          </Box>
          <Chip label={`${meal.items?.length || 0} items`} size="small" sx={{ background: `${color}15`, color, fontWeight: 700, fontSize: '11px' }} />
          <Typography sx={{ color: '#bbb', fontSize: '16px', transform: open ? 'rotate(180deg)' : 'none', transition: '0.25s' }}>▾</Typography>
        </Stack>
      </Box>

      {/* Meal items */}
      {open && (
        <Box sx={{ p: '4px 20px 16px' }}>
          {meal.items?.map((item, i) => <FoodItem key={i} item={item} accent={color} />)}
          {meal.mealTip && (
            <Box sx={{ mt: '12px', background: '#fffde7', border: '1px solid #fff176', borderRadius: '8px', p: '10px 14px' }}>
              <Typography fontSize="12px" color="#f57f17" fontWeight={600}>⏰ {meal.mealTip}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

// ── Shopping list ─────────────────────────────────────────────
const ShoppingList = ({ list }) => {
  const sections = [
    { key: 'proteins', label: '🥩 Proteins', color: '#e07000' },
    { key: 'carbs', label: '🌾 Carbs', color: '#0066cc' },
    { key: 'fats', label: '🥑 Healthy Fats', color: '#7a00cc' },
    { key: 'vegetables', label: '🥦 Vegetables', color: GREEN },
    { key: 'other', label: '🧂 Other', color: '#555' },
  ];

  return (
    <Box sx={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', p: '24px 28px' }}>
      <Typography fontWeight={800} fontSize="18px" color="#1a1a1a" mb="20px">🛒 Weekly Shopping List</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { lg: 'repeat(3, 1fr)', xs: 'repeat(2, 1fr)' }, gap: '16px' }}>
        {sections.map(({ key, label, color }) =>
          list[key]?.length > 0 ? (
            <Box key={key}>
              <Typography fontSize="12px" fontWeight={700} color={color} textTransform="uppercase" letterSpacing="1px" mb="8px">{label}</Typography>
              <Stack gap="4px">
                {list[key].map((item, i) => (
                  <Stack key={i} direction="row" gap="8px" alignItems="center">
                    <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <Typography fontSize="13px" color="#555">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ) : null
        )}
      </Box>
    </Box>
  );
};

// ── Main component ────────────────────────────────────────────
const NutritionPlan = ({ plan, loading, formData }) => {
  if (loading) return <Skeleton />;
  if (!plan) return <Empty />;

  const { dailyTargets, meals, hydrationPlan, supplementSuggestions, weeklyMealPrepTips, shoppingList, nutritionTips } = plan;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0f0e0', boxShadow: '0 4px 24px rgba(46,125,50,0.05)', p: '24px 28px', mb: '20px' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap="12px">
          <Box>
            <Stack direction="row" alignItems="center" gap="8px" mb="6px">
              <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: GREEN }} />
              <Typography fontSize="11px" fontWeight={700} color={GREEN} textTransform="uppercase" letterSpacing="2px">AI Nutrition Plan</Typography>
            </Stack>
            <Typography fontWeight={800} fontSize="22px" color="#1a1a1a">Your Daily Meal Plan</Typography>
            {formData && (
              <Typography fontSize="13px" color="#999" mt="4px">
                {formData.goal} · {formData.diet} · {formData.activity?.split(' ')[0]}
                {formData.weight ? ` · ${formData.weight}kg` : ''}
              </Typography>
            )}
          </Box>
          <Button onClick={() => window.print()} variant="outlined" sx={{
            borderColor: '#e0e0e0', color: '#777', borderRadius: '8px',
            textTransform: 'none', fontWeight: 600, fontSize: '13px',
            '&:hover': { borderColor: GREEN, color: GREEN, background: '#f0fff0' },
          }}>🖨 Print Plan</Button>
        </Stack>

        {/* Daily macro targets */}
        {dailyTargets && (
          <Box mt="20px">
            <Typography fontSize="11px" fontWeight={700} color="#bbb" textTransform="uppercase" letterSpacing="1px" mb="12px">Daily Targets</Typography>
            <Stack direction="row" gap="10px" flexWrap="wrap">
              <MacroPill label="Calories" value={dailyTargets.calories ? `${dailyTargets.calories} kcal` : '—'} color="#FF2625" />
              <MacroPill label="Protein" value={dailyTargets.protein || '—'} color="#e07000" />
              <MacroPill label="Carbs" value={dailyTargets.carbs || '—'} color="#0066cc" />
              <MacroPill label="Fats" value={dailyTargets.fats || '—'} color="#7a00cc" />
              <MacroPill label="Fiber" value={dailyTargets.fiber || '—'} color={GREEN} />
              <MacroPill label="Water" value={dailyTargets.water || '—'} color="#0099aa" />
            </Stack>
          </Box>
        )}
      </Box>

      {/* Meals */}
      <Box mb="20px">
        {meals?.map((meal, i) => <MealCard key={i} meal={meal} idx={i} />)}
      </Box>

      {/* Hydration */}
      {hydrationPlan && (
        <Box sx={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '14px', p: '20px 24px', mb: '16px' }}>
          <Typography fontWeight={700} fontSize="16px" color="#0066cc" mb="8px">💧 Hydration Plan</Typography>
          <Typography fontSize="14px" color="#1565c0" lineHeight={1.6}>{hydrationPlan}</Typography>
        </Box>
      )}

      {/* Supplements */}
      {supplementSuggestions?.length > 0 && (
        <Box sx={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '14px', p: '20px 24px', mb: '16px' }}>
          <Typography fontWeight={700} fontSize="16px" color="#e07000" mb="12px">💊 Supplement Suggestions</Typography>
          <Stack direction="row" gap="8px" flexWrap="wrap">
            {supplementSuggestions.map((s, i) => (
              <Chip key={i} label={s} sx={{ background: '#fff3cd', border: '1px solid #ffe082', color: '#856404', fontWeight: 600, fontSize: '13px' }} />
            ))}
          </Stack>
          <Typography fontSize="11px" color="#aaa" mt="10px">Always consult a doctor before starting any supplement regime.</Typography>
        </Box>
      )}

      {/* Meal prep tips */}
      {weeklyMealPrepTips?.length > 0 && (
        <Box sx={{ background: '#f0fff0', border: '1px solid #c8e6c9', borderRadius: '14px', p: '20px 24px', mb: '16px' }}>
          <Typography fontWeight={700} fontSize="16px" color={GREEN} mb="12px">🍱 Meal Prep Tips</Typography>
          <Stack gap="8px">
            {weeklyMealPrepTips.map((tip, i) => (
              <Stack key={i} direction="row" gap="10px" alignItems="flex-start">
                <Box sx={{ width: '20px', height: '20px', borderRadius: '50%', background: GREEN, color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '1px' }}>{i + 1}</Box>
                <Typography fontSize="14px" color="#2d5a2d" lineHeight={1.6}>{tip}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {/* Shopping list */}
      {shoppingList && <Box mb="16px"><ShoppingList list={shoppingList} /></Box>}

      {/* Nutrition tips */}
      {nutritionTips?.length > 0 && (
        <Box sx={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', p: '24px 28px' }}>
          <Typography fontWeight={800} fontSize="17px" color="#1a1a1a" mb="16px">💡 Nutrition Tips</Typography>
          <Stack gap="10px">
            {nutritionTips.map((tip, i) => (
              <Stack key={i} direction="row" gap="12px" alignItems="flex-start">
                <Typography fontSize="16px" flexShrink={0} color={GREEN}>✓</Typography>
                <Typography fontSize="14px" color="#555" lineHeight={1.6}>{tip}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default NutritionPlan;