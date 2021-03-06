import React, {FC} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup  from '@mui/material/RadioGroup';
import { Bubble } from '../interfaces'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const BubbleQuestion: FC<Bubble> = ({ choice_list, required = true, question_name, handleChange,  value }) => {


  return (
    <FormControl
      required={required}
    >
      <FormLabel id="question-label">{question_name}</FormLabel>
      <RadioGroup
        aria-labelledby="question-label"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {choice_list.map((choice,idx) => <FormControlLabel key={idx} value={Object.values(choice)[0]} control={<Radio />} label={Object.keys(choice)[0]} />)}
      </RadioGroup>
    </FormControl>
  );
};

export default BubbleQuestion;