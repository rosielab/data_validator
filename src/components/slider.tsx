import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Slider from "@mui/material/Slider";
import { Slide } from '../interfaces'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const SliderQuestion: FC<Slide> = ({left_label, right_label, num_ticks , required = true, question_name, handleChange, question_id, value }) => {

  const end_marks = [
    {
      value: 1,
      label: left_label,
    },
    {
      value: num_ticks,
      label: right_label,
    },
  ];
  return (
    <FormControl
      required={required}
    >
    <FormLabel id="question-label">{question_name}</FormLabel>
      <Slider
        style={{ width: 300 }}
        min={1}
        max={num_ticks}
        step={1}
        value={value}
        marks={end_marks}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby={question_name}
      />
    </FormControl>
  );
};

export default SliderQuestion;