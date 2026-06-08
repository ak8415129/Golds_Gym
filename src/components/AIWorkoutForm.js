import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';

// ── Equipment options ──────────────────────────────────────────
const EQUIPMENT_OPTIONS = [
  'No Equipment (Bodyweight)',
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Kettlebell',
  'Cable Machine',
  'Full Gym Access',
];

const chipStyle = (selected) => ({
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
  border: selected ? '2px solid #FF2625' : '2px solid #e0e0e0',
  background: selected ? '#fff0f0' : '#fff',
  color: selected ? '#FF2625' : '#555',
  '&:hover': { borderColor: '#FF2625', background: '#fff0f0' },
  transition: '0.2s all',
});

const AIWorkoutForm = ({ setWorkoutPlan, setLoading, loading, setFormData }) => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [days, setDays] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [age, setAge] = useState('');
  const [injuries, setInjuries] = useState('');
  const [error, setError] = useState('');

  const toggleEquipment = (item) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    if (!goal || !level || !days) {
      setError('Please fill in Goal, Fitness Level, and Days per Week.');
      return;
    }
    if (equipment.length === 0) {
      setError('Please select at least one equipment option.');
      return;
    }
    setError('');
    setLoading(true);
    setWorkoutPlan(null);

    const userForm = { goal, level, days, equipment, age, injuries };
    setFormData(userForm);

    const equipmentList = equipment.join(', ');
    const injuryNote = injuries ? `The user has the following injuries or limitations: ${injuries}.` : '';
    const ageNote = age ? `The user is ${age} years old.` : '';

    const prompt = `You are an expert personal trainer. Create a detailed ${days}-day-per-week workout plan for a ${level} level person whose goal is: ${goal}. ${ageNote} Available equipment: ${equipmentList}. ${injuryNote}

Return the plan in this EXACT JSON format, no extra text, no markdown fences:

{
  "weeklyPlan": [
    {
      "day": "Day 1",
      "focus": "e.g. Chest & Triceps",
      "warmup": "Brief warmup description (2-3 sentences)",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": "3",
          "reps": "10-12",
          "rest": "60 sec",
          "tips": "Key form tip"
        }
      ],
      "cooldown": "Brief cooldown description"
    }
  ],
  "weeklyTips": ["tip1", "tip2", "tip3"],
  "estimatedCaloriesPerSession": "300-400",
  "totalWeeklyDuration": "4-5 hours"
}

Include exactly ${days} workout days. Make it realistic, progressive, and safe.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const rawText = data.content?.find((b) => b.type === 'text')?.text || '';

      // Strip any accidental markdown fences
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setWorkoutPlan(parsed);
    } catch (err) {
      console.error('AI generation error:', err);
      setError('Something went wrong generating your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a1a1a',
    mb: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const selectStyle = {
    borderRadius: '8px',
    background: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF2625' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF2625' },
  };

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        p: { lg: '32px', xs: '24px' },
      }}
    >
      <Typography fontWeight={700} fontSize="20px" color="#1a1a1a" mb="24px">
        🎯 Tell Us About You
      </Typography>

      <Stack gap="20px">
        {/* Goal */}
        <Box>
          <Typography sx={labelStyle}>Fitness Goal *</Typography>
          <FormControl fullWidth>
            <Select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              displayEmpty
              sx={selectStyle}
            >
              <MenuItem value="" disabled>Select your goal</MenuItem>
              <MenuItem value="Build muscle and increase strength">💪 Build Muscle & Strength</MenuItem>
              <MenuItem value="Lose weight and burn fat">🔥 Lose Weight & Burn Fat</MenuItem>
              <MenuItem value="Improve cardiovascular fitness and endurance">🏃 Cardio & Endurance</MenuItem>
              <MenuItem value="Increase flexibility and mobility">🧘 Flexibility & Mobility</MenuItem>
              <MenuItem value="Athletic performance and sports training">⚡ Athletic Performance</MenuItem>
              <MenuItem value="General fitness and stay active">✅ General Fitness</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Fitness Level */}
        <Box>
          <Typography sx={labelStyle}>Fitness Level *</Typography>
          <FormControl fullWidth>
            <Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              displayEmpty
              sx={selectStyle}
            >
              <MenuItem value="" disabled>Select your level</MenuItem>
              <MenuItem value="complete beginner">🌱 Beginner (0–6 months)</MenuItem>
              <MenuItem value="intermediate">📈 Intermediate (6 months–2 years)</MenuItem>
              <MenuItem value="advanced">🏆 Advanced (2+ years)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Days per week */}
        <Box>
          <Typography sx={labelStyle}>Days Per Week *</Typography>
          <FormControl fullWidth>
            <Select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              displayEmpty
              sx={selectStyle}
            >
              <MenuItem value="" disabled>How many days?</MenuItem>
              {[2, 3, 4, 5, 6].map((d) => (
                <MenuItem key={d} value={d}>{d} days / week</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Equipment */}
        <Box>
          <Typography sx={labelStyle}>Available Equipment *</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EQUIPMENT_OPTIONS.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => toggleEquipment(item)}
                sx={chipStyle(equipment.includes(item))}
              />
            ))}
          </Box>
        </Box>

        {/* Age (optional) */}
        <Box>
          <Typography sx={labelStyle}>Age <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span></Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g. 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputProps={{ min: 10, max: 100 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': { borderColor: '#FF2625' },
                '&.Mui-focused fieldset': { borderColor: '#FF2625' },
              },
            }}
          />
        </Box>

        {/* Injuries (optional) */}
        <Box>
          <Typography sx={labelStyle}>
            Injuries / Limitations{' '}
            <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(optional)</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="e.g. bad knees, lower back pain..."
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': { borderColor: '#FF2625' },
                '&.Mui-focused fieldset': { borderColor: '#FF2625' },
              },
            }}
          />
        </Box>

        {/* Error */}
        {error && (
          <Typography color="#FF2625" fontSize="13px" fontWeight={600}>
            ⚠️ {error}
          </Typography>
        )}

        {/* Submit */}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            bgcolor: loading ? '#ccc' : '#FF2625',
            color: '#fff',
            fontWeight: 700,
            fontSize: '16px',
            py: '14px',
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#cc1f1e' },
            '&:disabled': { bgcolor: '#ccc', color: '#fff' },
            transition: '0.2s',
          }}
        >
          {loading ? '⏳ Generating your plan...' : '🤖 Generate My Workout Plan'}
        </Button>
      </Stack>
    </Box>
  );
};

export default AIWorkoutForm;