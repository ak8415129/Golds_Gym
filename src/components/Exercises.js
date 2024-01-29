import React ,{useState ,useEffect} from 'react' 
import { Pagination } from '@mui/material' 
import {Box,Stack,Typography} from '@mui/material';
import { exerciseOptions,fetchData } from '../utils/fetchData'; 



function Exercises({exercises, setExercises, bodyPart}) {
  console.log(exercises);
  return (
    <Box
    
    >
     <Typography>
      Showing Results
     </Typography>
    </Box>
  )
}

export default Exercises