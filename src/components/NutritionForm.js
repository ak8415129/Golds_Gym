import React, { useState } from 'react';
import {
  Box, Button, FormControl, MenuItem,
  Select, Stack, TextField, Typography, Chip,
} from '@mui/material';

const GREEN = '#2e7d32';

const DIET_TYPES = [
  'No Restriction', 'Vegetarian', 'Vegan', 'Keto / Low-Carb',
  'Paleo', 'Mediterranean', 'Dairy-Free', 'Gluten-Free', 'High Protein',
];

const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Shellfish', 'Soy', 'Fish'];

const chipSx = (selected) => ({
  cursor: 'pointer', fontWeight: 600, fontSize: '12px',
  border: selected ? `2px solid ${GREEN}` : '2px solid #e0e0e0',
  background: selected ? '#f0fff0' : '#fff',
  color: selected ? GREEN : '#555',
  '&:hover': { borderColor: GREEN, background: '#f0fff0' },
  transition: '0.2s all',
});

const selectSx = {
  borderRadius: '8px', background: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: GREEN },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': { borderColor: GREEN },
    '&.Mui-focused fieldset': { borderColor: GREEN },
  },
};

const Label = ({ children }) => (
  <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', mb: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
    {children}
  </Typography>
);

const NutritionForm = ({ setPlan, setLoading, loading, setFormData }) => {
  const [goal, setGoal] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('');
  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [disliked, setDisliked] = useState('');
  const [error, setError] = useState('');

  const toggleAllergy = (item) =>
    setAllergies((prev) => prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]);

  const handleGenerate = async () => {
    if (!goal || !activity || !diet) {
      setError('Please fill in Goal, Activity Level, and Dietary Preference.');
      return;
    }
    setError(''); setLoading(true); setPlan(null);

    const form = { goal, gender, age, weight, height, activity, diet, allergies, mealsPerDay, disliked };
    setFormData(form);

    const prompt = `You are a certified nutritionist and dietitian. Create a detailed personalised daily meal plan.
User profile:
- Nutrition goal: ${goal}
- Activity level: ${activity}
- Dietary preference: ${diet}
${gender ? `- Gender: ${gender}` : ''}
${age ? `- Age: ${age}` : ''}
${weight ? `- Weight: ${weight} kg` : ''}
${height ? `- Height: ${height} cm` : ''}
${allergies.length ? `- Allergies/foods to avoid: ${allergies.join(', ')}` : ''}
${mealsPerDay ? `- Preferred meals per day: ${mealsPerDay}` : ''}
${disliked ? `- Disliked foods: ${disliked}` : ''}

Return ONLY this JSON, no markdown, no extra text:
{
  "dailyTargets": {
    "calories": "2200",
    "protein": "165g",
    "carbs": "220g",
    "fats": "73g",
    "fiber": "30g",
    "water": "3L"
  },
  "meals": [
    {
      "name": "Breakfast",
      "time": "7:00 AM",
      "calories": "450",
      "items": [
        { "food": "Oats with berries", "amount": "80g oats + 100g berries", "protein": "12g", "carbs": "55g", "fats": "5g", "notes": "High fibre, slow release energy" }
      ],
      "mealTip": "Eat within 1 hour of waking"
    }
  ],
  "hydrationPlan": "Drink 500ml water on waking. Sip 250ml every hour during workouts.",
  "supplementSuggestions": ["Creatine 5g/day", "Vitamin D 2000IU"],
  "weeklyMealPrepTips": ["tip1", "tip2", "tip3"],
  "shoppingList": {
    "proteins": ["item1", "item2"],
    "carbs": ["item1", "item2"],
    "fats": ["item1", "item2"],
    "vegetables": ["item1", "item2"],
    "other": ["item1"]
  },
  "nutritionTips": ["tip1", "tip2", "tip3"]
}

Make the plan practical, delicious, and achievable. Include exactly ${mealsPerDay || 5} meals.`;

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();

      // Surface server-side errors clearly
      if (!res.ok || data.error) {
        const msg = data.error || data.message || `Server error ${res.status}`;
        const fix = data.fix ? ` — ${data.fix}` : '';
        setError(`${msg}${fix}`);
        return;
      }

      const raw = data.content?.find((b) => b.type === 'text')?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      setPlan(JSON.parse(clean));
    } catch (err) {
      console.error('Nutrition AI error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot reach the proxy server. Make sure you ran "npm run dev" and the server started on port 3001.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0f0e0', boxShadow: '0 4px 32px rgba(46,125,50,0.06)', p: { lg: '32px', xs: '20px' } }}>
      <Stack direction="row" alignItems="center" gap="10px" mb="24px">
        <Box sx={{ width: '36px', height: '36px', background: GREEN, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🥗</Box>
        <Typography fontWeight={800} fontSize="20px" color="#1a1a1a">Your Nutrition Profile</Typography>
      </Stack>

      <Stack gap="18px">

        {/* Goal */}
        <Box>
          <Label>Nutrition Goal *</Label>
          <FormControl fullWidth>
            <Select value={goal} onChange={(e) => setGoal(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>Select your goal</MenuItem>
              <MenuItem value="Lose body fat and get lean">🔥 Lose Body Fat & Get Lean</MenuItem>
              <MenuItem value="Build muscle mass and bulk up">💪 Build Muscle & Bulk Up</MenuItem>
              <MenuItem value="Maintain weight and eat healthier">⚖️ Maintain Weight & Eat Healthy</MenuItem>
              <MenuItem value="Improve athletic performance and endurance">⚡ Athletic Performance</MenuItem>
              <MenuItem value="Improve gut health and digestion">🌿 Gut Health & Digestion</MenuItem>
              <MenuItem value="Increase energy levels throughout the day">☀️ More Energy</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Activity level */}
        <Box>
          <Label>Activity Level *</Label>
          <FormControl fullWidth>
            <Select value={activity} onChange={(e) => setActivity(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>Select activity level</MenuItem>
              <MenuItem value="sedentary (desk job, little exercise)">🪑 Sedentary (desk job)</MenuItem>
              <MenuItem value="lightly active (1-3 workouts per week)">🚶 Lightly Active (1–3×/week)</MenuItem>
              <MenuItem value="moderately active (3-5 workouts per week)">🏃 Moderately Active (3–5×/week)</MenuItem>
              <MenuItem value="very active (6-7 intense workouts per week)">🏋️ Very Active (6–7×/week)</MenuItem>
              <MenuItem value="extremely active (athlete, physical job)">⚡ Athlete / Physical Job</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Dietary preference */}
        <Box>
          <Label>Dietary Preference *</Label>
          <FormControl fullWidth>
            <Select value={diet} onChange={(e) => setDiet(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>Select diet type</MenuItem>
              {DIET_TYPES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Meals per day */}
        <Box>
          <Label>Meals Per Day</Label>
          <FormControl fullWidth>
            <Select value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="">Default (5 meals)</MenuItem>
              {[3, 4, 5, 6].map((n) => <MenuItem key={n} value={n}>{n} meals/day</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Allergies */}
        <Box>
          <Label>Allergies / Avoid <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ALLERGIES.map((item) => (
              <Chip key={item} label={item} onClick={() => toggleAllergy(item)} sx={chipSx(allergies.includes(item))} />
            ))}
          </Box>
        </Box>

        {/* Row: gender + age */}
        <Stack direction="row" gap="12px">
          <Box flex={1}>
            <Label>Gender <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(opt)</span></Label>
            <FormControl fullWidth>
              <Select value={gender} onChange={(e) => setGender(e.target.value)} displayEmpty sx={selectSx}>
                <MenuItem value="">Prefer not to say</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex={1}>
            <Label>Age <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(opt)</span></Label>
            <TextField fullWidth type="number" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} inputProps={{ min: 10, max: 100 }} sx={inputSx} />
          </Box>
        </Stack>

        {/* Row: weight + height */}
        <Stack direction="row" gap="12px">
          <Box flex={1}>
            <Label>Weight (kg) <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(opt)</span></Label>
            <TextField fullWidth type="number" placeholder="e.g. 75" value={weight} onChange={(e) => setWeight(e.target.value)} sx={inputSx} />
          </Box>
          <Box flex={1}>
            <Label>Height (cm) <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(opt)</span></Label>
            <TextField fullWidth type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} sx={inputSx} />
          </Box>
        </Stack>

        {/* Disliked foods */}
        <Box>
          <Label>Disliked Foods <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <TextField fullWidth multiline rows={2} placeholder="e.g. broccoli, tuna, mushrooms..." value={disliked} onChange={(e) => setDisliked(e.target.value)} sx={inputSx} />
        </Box>

        {error && (
          <Box sx={{ background: '#f0fff0', border: '1px solid #a5d6a7', borderRadius: '8px', p: '12px 16px' }}>
            <Typography color={GREEN} fontSize="13px" fontWeight={600}>⚠️ {error}</Typography>
          </Box>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          fullWidth
          sx={{
            bgcolor: loading ? '#ddd' : GREEN,
            color: '#fff', fontWeight: 700, fontSize: '16px', py: '14px',
            borderRadius: '10px', textTransform: 'none',
            '&:hover': { bgcolor: '#1b5e20' },
            '&:disabled': { bgcolor: '#ddd', color: '#fff' },
            boxShadow: loading ? 'none' : '0 4px 16px rgba(46,125,50,0.3)',
            transition: '0.2s',
          }}
        >
          {loading ? '⏳ Creating your meal plan...' : '🥗 Generate My Nutrition Plan'}
        </Button>
      </Stack>
    </Box>
  );
};

export default NutritionForm;