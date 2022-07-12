import React, { useEffect } from 'react';
import './App.css';
import BubbleQuestion from "./components/bubble"
import SliderQuestion from "./components/slider"
import { Grid, Button, Typography, TextField } from '@mui/material';
import AudioCard from './audiocard';
import questionInfo from "./config.json";

function App() {

  const num_samples = questionInfo["num_samples"];
  var i: number = 0;

  // @ts-ignore
  const sample_list: Array<Number> = [...Array(num_samples).keys()];

  const isSelected = () => {
      for (var key in answersToQuestions){
        // @ts-ignore ????????
        if (answersToQuestions["question0"] === "Yes" & (answersToQuestions[key] === "" || answersToQuestions[key] === [] || answersToQuestions[key] === 0)) {
          return(true)
        }
      }
      return(false)
  };

  const getAudiolist = async (validatorid: number) => {
    try{
      const response = await fetch(`http://localhost:4000/init?${validatorid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      return error;
    }
  }

  const getAudioInfo = async (audioid: number) => {
    try{
      const response = await fetch(`http://localhost:4000/audio?${audioid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      return error;
    }
  }

  const sendId = async (validatorID: number) => {
    try{
      const response = await fetch('https://localhost:4000/user', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatorID),
      })
      const data = await response.json();
      const audiolist = getAudiolist(validatorID)
      return [data, audiolist];
    } catch (error) {
      return error;
    }
  }

  const sendResetPage = async (responses: object, validatorID: number)  => {
    const alldata = {
      responses: responses,
      validatorID: validatorID
    }
    try{
      const response = await fetch('https://localhost:4000/responses', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alldata),
      })
      const data = await response.json();
      setAnswersToQuestions(
        tempanswers
      )
      var nextId = audiolist[i+1]
      getAudioInfo(nextId)
      return data;
    } catch (error) {
      return error;
    }
  }

  const [answersToQuestions, setAnswersToQuestions] = React.useState({
    "question0": "No"
  });

  //how do I tpe this to validate??
  const [validatorID, setValidatorId] = React.useState();

  useEffect(() => {
    const tempanswers: {[key: string]: number | string | Array<string>} = {}
    // Iterate through JSON and add keys to object that map to IDs
    questionInfo["question_info"].forEach(
      (question, idx) => {
        if (
            question["type"] === "bubble"
            || question["type"] === "ranking"
            || question["type"] === "shorttext"
            || question["type"] === "longtext"
        ) {
          tempanswers[`question${idx+1}`] = ""
        } else if (question["type"] === "slide") {
          tempanswers[`question${idx+1}`] = 0
        } else if (question["type"] === "checkbox") {
          tempanswers[`question${idx+1}`] = []
        }
      }
    )
    setAnswersToQuestions({
      ...answersToQuestions,
      ...tempanswers
    })
  }, []);

  useEffect(() => {
    const tempanswers: {[key: string]: number | string | Array<string>} = {}
    // Iterate through JSON and add keys to object that map to IDs
    questionInfo["question_info"].forEach(
      (question, idx) => {
        if (
            question["type"] === "bubble"
            || question["type"] === "ranking"
            || question["type"] === "shorttext"
            || question["type"] === "longtext"
        ) {
          tempanswers[`question${idx+1}`] = ""
        } else if (question["type"] === "slide") {
          tempanswers[`question${idx+1}`] = 0
        } else if (question["type"] === "checkbox") {
          tempanswers[`question${idx+1}`] = []
        }
      }
    )
    setAnswersToQuestions({
      ...answersToQuestions,
      ...tempanswers
    })
  }, []);

  const handleChangeToAnswerToQuestions = (event: React.ChangeEvent<HTMLInputElement> | Event, idToModify: string) => {
    setAnswersToQuestions({
      // Leave everything else the same
      ...answersToQuestions,
      // Change idToModify to a specified value
      [idToModify]: (event.target as HTMLInputElement).value,
    });
  };

  return (
    <Grid>
      <TextField
        id="standard-helperText"
        label="validatorid"
        required
        value = {validatorID}
        onChange={(event) => setValidatorId({event.target.value})}
      />
      <Button
        size='large'
        variant='contained'
        className='text-white bg-blue-500 m-3'
        onClick={sendId(validatorID)}>Submit
      </Button>
      {sample_list.map((idx) =>
        // @ts-ignore
        <Grid key={idx} item xs={12}>
          <AudioCard
            title={`Audio Sample ${Number(idx) + 1}`}
            //SET UP API CALL TO LOAD THE AUDIO
            soundfile={"http://localhost:3000/data/recording.m4a"}
          />
        </Grid>
      )}
      {
        //Call to load what to display here
      }
      <Typography
        align="center"
      >
          This will be the script once the backend is up
      </Typography>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        <Grid item>
        <BubbleQuestion
          question_name={"Does the audio match the script above?"}
          choice_list={["Yes","No"]}
          required={true}
          // @ts-ignore
          value={answersToQuestions[`question0`]}
          question_id={`question0`}
          handleChange={(event) => {handleChangeToAnswerToQuestions(event, "question0")}}
        />
        </Grid>
        {
          answersToQuestions['question0'] === 'Yes' && questionInfo["question_info"].map((question, idx) => {
            if (question["type"] === "bubble") {
              return(
                <Grid 
                  item
                  key={idx}
                >
                  <BubbleQuestion
                    key={idx}
                    question_name={question["data"]["question_name"]}
                    choice_list={question["data"]["choice_list"] || []}
                    required={question["data"]["required"]}
                    // @ts-ignore
                    value={answersToQuestions[`question${idx+1}`]}
                    question_id={`question${idx+1}`}
                    handleChange={(event) => {handleChangeToAnswerToQuestions(event, `question${idx+1}`)}}
                  />
                </Grid>
              )
            } else if (question["type"] === "slide") {
              return(
                <Grid
                  item
                  key={idx}
                >
                  <SliderQuestion
                    key={idx}
                    question_name={question["data"]["question_name"]}
                    left_label={question["data"]["left_label"] || ""}
                    right_label={question["data"]["right_label"] || ""}
                    num_ticks={question["data"]["num_ticks"] || 0} 
                    required={question["data"]["required"]}
                    // @ts-ignore
                    value={answersToQuestions[`question${idx+1}`]}
                    question_id={`question${idx+1}`}
                    handleChange={(event) => {handleChangeToAnswerToQuestions(event, `question${idx+1}`)}}
                  />
                </Grid>
              )
            }  else if (question["type"] === "checkbox") {
              return(
                <Grid item>
                  {
                    //component needs to be created
                  }
                </Grid>
              )
            }  else if (question["type"] === "shorttext") {
              return(
                <Grid item>
                  {
                    //component needs to be created
                  }
                </Grid>
              )
            } else if (question["type"] === "longtext") {
              return(
                <Grid item>
                  {
                    //component needs to be created
                  }
                </Grid>
              )
            } else if (question["type"] === "ranking") {
              return(
                <Grid item>
                  {
                    //component needs to be created
                  }
                </Grid>
              )
            }
            return null;
          })
        }
        <Button
          type="submit"
          variant="contained"
          sx={{ margin: 1 }}
          disabled={isSelected()}
          onClick={sendResetPage(answersToQuestions, validatorID)}}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
