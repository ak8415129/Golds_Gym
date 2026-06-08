import React, { useState } from 'react';
import {
  Box, Button, FormControl, MenuItem,
  Select, Stack, TextField, Typography, Chip,
} from '@mui/material';

const EQUIPMENT_OPTIONS = [
  'No Equipment (Bodyweight)', 'Dumbbells', 'Barbell',
  'Resistance Bands', 'Pull-up Bar', 'Kettlebell',
  'Cable Machine', 'Full Gym Access',
];

const ACCENT = '#FF2625';

const chipSx = (selected) => ({
  cursor: 'pointer', fontWeight: 600, fontSize: '12px',
  border: selected ? `2px solid ${ACCENT}` : '2px solid #e0e0e0',
  background: selected ? '#fff0f0' : '#fff',
  color: selected ? ACCENT : '#555',
  '&:hover': { borderColor: ACCENT, background: '#fff0f0' },
  transition: '0.2s all',
});

const selectSx = {
  borderRadius: '8px', background: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': { borderColor: ACCENT },
    '&.Mui-focused fieldset': { borderColor: ACCENT },
  },
};

const Label = ({ children }) => (
  <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', mb: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
    {children}
  </Typography>
);

const ExerciseForm = ({ setPlan, setLoading, loading, setFormData }) => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [days, setDays] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [age, setAge] = useState('');
  const [injuries, setInjuries] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [sessionLength, setSessionLength] = useState('');
  const [error, setError] = useState('');

  const toggleEquip = (item) =>
    setEquipment((prev) => prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]);

  const handleGenerate = async () => {
    if (!goal || !level || !days || equipment.length === 0) {
      setError('Please fill in Goal, Level, Days per Week, and at least one Equipment option.');
      return;
    }
    setError(''); setLoading(true); setPlan(null);
    const form = { goal, level, days, equipment, age, injuries, focusArea, sessionLength };
    setFormData(form);

    const prompt = `You are an elite personal trainer. Create a detailed ${days}-day-per-week workout plan.
User profile:
- Goal: ${goal}
- Fitness level: ${level}
- Available equipment: ${equipment.join(', ')}
${age ? `- Age: ${age}` : ''}
${injuries ? `- Injuries/limitations: ${injuries}` : ''}
${focusArea ? `- Focus area: ${focusArea}` : ''}
${sessionLength ? `- Preferred session length: ${sessionLength} minutes` : ''}

Return ONLY this JSON, no markdown, no extra text:
{
  "weeklyPlan": [
    {
      "day": "Day 1",
      "focus": "Chest & Triceps",
      "duration": "45-60 min",
      "warmup": "5-min warmup description",
      "exercises": [
        { "name": "Bench Press", "sets": "4", "reps": "8-10", "rest": "90 sec", "tips": "Keep shoulder blades retracted" }
      ],
      "cooldown": "5-min cooldown description"
    }
  ],
  "progressionTips": ["tip1", "tip2", "tip3"],
  "weeklyTips": ["tip1", "tip2", "tip3"],
  "estimatedCaloriesPerSession": "350-500",
  "totalWeeklyDuration": "3-4 hours"
}
Include exactly ${days} workout days. Be specific, practical and progressive.`;

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
      console.error('Exercise AI error:', err);
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
    <Box sx={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e0e0', boxShadow: '0 4px 32px rgba(255,38,37,0.06)', p: { lg: '32px', xs: '20px' } }}>
      <Stack direction="row" alignItems="center" gap="10px" mb="24px">
        <Box sx={{ width: '36px', height: '36px', background: ACCENT, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💪</Box>
        <Typography fontWeight={800} fontSize="20px" color="#1a1a1a">Your Fitness Profile</Typography>
      </Stack>

      <Stack gap="18px">

        {/* Goal */}
        <Box>
          <Label>Fitness Goal *</Label>
          <FormControl fullWidth>
            <Select value={goal} onChange={(e) => setGoal(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>Select your goal</MenuItem>
              <MenuItem value="Build muscle and increase strength">💪 Build Muscle & Strength</MenuItem>
              <MenuItem value="Lose weight and burn fat">🔥 Lose Weight & Burn Fat</MenuItem>
              <MenuItem value="Improve cardiovascular fitness and endurance">🏃 Cardio & Endurance</MenuItem>
              <MenuItem value="Increase flexibility and mobility">🧘 Flexibility & Mobility</MenuItem>
              <MenuItem value="Athletic performance and sports training">⚡ Athletic Performance</MenuItem>
              <MenuItem value="General fitness and stay active">✅ General Fitness</MenuItem>
              <MenuItem value="Powerlifting and strength sport">🏋️ Powerlifting</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Level */}
        <Box>
          <Label>Fitness Level *</Label>
          <FormControl fullWidth>
            <Select value={level} onChange={(e) => setLevel(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>Select your level</MenuItem>
              <MenuItem value="complete beginner with little exercise experience">🌱 Beginner (0–6 months)</MenuItem>
              <MenuItem value="intermediate with 6-24 months of consistent training">📈 Intermediate (6mo–2 years)</MenuItem>
              <MenuItem value="advanced with 2+ years of serious training">🏆 Advanced (2+ years)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Days */}
        <Box>
          <Label>Days Per Week *</Label>
          <FormControl fullWidth>
            <Select value={days} onChange={(e) => setDays(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="" disabled>How many days?</MenuItem>
              {[2, 3, 4, 5, 6].map((d) => <MenuItem key={d} value={d}>{d} days / week</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Equipment */}
        <Box>
          <Label>Available Equipment *</Label>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EQUIPMENT_OPTIONS.map((item) => (
              <Chip key={item} label={item} onClick={() => toggleEquip(item)} sx={chipSx(equipment.includes(item))} />
            ))}
          </Box>
        </Box>

        {/* Focus area */}
        <Box>
          <Label>Focus Area <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <FormControl fullWidth>
            <Select value={focusArea} onChange={(e) => setFocusArea(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="">No specific preference</MenuItem>
              <MenuItem value="Upper body focus">Upper Body</MenuItem>
              <MenuItem value="Lower body and legs focus">Lower Body & Legs</MenuItem>
              <MenuItem value="Core and abs focus">Core & Abs</MenuItem>
              <MenuItem value="Full body balanced">Full Body Balanced</MenuItem>
              <MenuItem value="Back and posterior chain focus">Back & Posterior Chain</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Session length */}
        <Box>
          <Label>Session Length <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <FormControl fullWidth>
            <Select value={sessionLength} onChange={(e) => setSessionLength(e.target.value)} displayEmpty sx={selectSx}>
              <MenuItem value="">Any length</MenuItem>
              <MenuItem value="30">30 minutes</MenuItem>
              <MenuItem value="45">45 minutes</MenuItem>
              <MenuItem value="60">60 minutes</MenuItem>
              <MenuItem value="75">75 minutes</MenuItem>
              <MenuItem value="90">90 minutes</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Age */}
        <Box>
          <Label>Age <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <TextField fullWidth type="number" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} inputProps={{ min: 10, max: 100 }} sx={inputSx} />
        </Box>

        {/* Injuries */}
        <Box>
          <Label>Injuries / Limitations <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Label>
          <TextField fullWidth multiline rows={2} placeholder="e.g. bad knees, lower back pain, shoulder impingement..." value={injuries} onChange={(e) => setInjuries(e.target.value)} sx={inputSx} />
        </Box>

        {error && (
          <Box sx={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', p: '12px 16px' }}>
            <Typography color={ACCENT} fontSize="13px" fontWeight={600}>⚠️ {error}</Typography>
          </Box>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          fullWidth
          sx={{
            bgcolor: loading ? '#ddd' : ACCENT,
            color: '#fff', fontWeight: 700, fontSize: '16px', py: '14px',
            borderRadius: '10px', textTransform: 'none',
            '&:hover': { bgcolor: '#cc1f1e' },
            '&:disabled': { bgcolor: '#ddd', color: '#fff' },
            boxShadow: loading ? 'none' : '0 4px 16px rgba(255,38,37,0.3)',
            transition: '0.2s',
          }}
        >
          {loading ? '⏳ Building your plan...' : '💪 Generate My Exercise Plan'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ExerciseForm;