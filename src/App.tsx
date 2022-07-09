import React, { useEffect } from 'react';
import './App.css';
import BubbleQuestion from "./components/bubble"
import SliderQuestion from "./components/slider"
import { Grid, Button, Typography } from '@mui/material';
import AudioCard from './audiocard';
import questionInfo from "./config.json";

function App() {

  const num_samples = questionInfo["num_samples"];
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

  const [answersToQuestions, setAnswersToQuestions] = React.useState({
    "question0": "No"
  });

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
          //onClick={async (e) => {
          //  await handleSelection(
          //      (e.target as HTMLInputElement).value
          //  );
          //  focusOnNext();
          //}}
          onClick={async (e) => {
              console.log(answersToQuestions)
            }
          }
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
