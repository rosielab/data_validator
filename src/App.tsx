import React, { RefObject, useEffect } from 'react';
import './App.css';
import BubbleQuestion from "./components/bubble"
import SliderQuestion from "./components/slider"
import { Grid, Button, Typography, TextField } from '@mui/material';
import AudioCard from './audiocard';
import questionInfo from "./config.json";

function App() {

  const num_samples = questionInfo["num_samples"];
  let tracking: number = 0;

  const isSelected = () => {
      for (var key in answersToQuestions){
        // @ts-ignore ????????
        if (answersToQuestions["question0"] === "Yes" & (answersToQuestions[key] === "" || answersToQuestions[key] === [] || answersToQuestions[key] === 0)) {
          return(true)
        }
      }
      return(false)
  };

  const getAudioList = async (validatorid: Number) => {
    try{
      console.log(validatorid);
      const response = await fetch(`http://localhost:4000/init?${validatorid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      return error;
    }
  }

  const getAudioInfo = async (audioid: Number) => {
    try{
      const response = await fetch(`http://localhost:4000/audio?${audioid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      return error;
    }
  }

  const sendId = async (validatorID: Number) => {
    try{
      const response = await fetch('https://localhost:4000/user', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatorID),
      })
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }


  //const sendResetPage = async (responses: object, validatorID: number)  => {
  //  const alldata = {
  //    responses: responses,
  //    validatorID: validatorID
  //  }
  //  try{
  //    const response = await fetch('https://localhost:4000/responses', {
  //      method: 'POST', 
  //      headers: {
  //        'Content-Type': 'application/json',
  //      },
  //      body: JSON.stringify(alldata),
  //    })
  //    const data = await response.json();
  //    setAnswersToQuestions(
  //      tempanswers
  //    )
  //    var nextId = audiolist[i+1]
  //    return data;
  //  } catch (error) {
  //    return error;
  //  }
  //}

  const [answersToQuestions, setAnswersToQuestions] = React.useState({
    "question0": "No"
  });

  //how do I tpe this to validate??
  const [validatorID, setValidatorId] = React.useState(0);

  const [textValue, setTextValue] = React.useState('');

  const [audioListState, setAudioList] = React.useState([[]] as Array<Array<Number>>);

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

  if (!validatorID) {
    return (
      <Grid container padding = {2}>
        <Grid item>
          <TextField
            id="standard-helperText"
            label="validatorid"
            required
            value = {textValue}
            onChange = {(event) => setTextValue(event.target.value)}
          />
        </Grid>
        <Grid item padding = {2}>
          <Button
            size='large'
            variant='contained'
            className='text-white bg-blue-500 m-3'
            onClick={async () => {
              const insideValidatorId: Number = Number(textValue);
              setValidatorId(Number(insideValidatorId));
              await sendId(insideValidatorId);
              const audioObject = await getAudioList(insideValidatorId);
              const audioList: Array<Array<Number>> = [];
              let tempArray: Array<object> = [];
              audioObject.forEach((obj: object) => {
                if (tempArray.length === num_samples) {
                  audioList.push(tempArray as Array<Number>);
                  tempArray = [];
                }
                tempArray.push(obj);
              });
              if (tempArray.length) {
                audioList.push(tempArray as Array<Number>);
              }
              setAudioList(audioList);
              console.log(audioList)
            }}>
              Submit
          </Button>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid>
      <>
        {
          audioListState[tracking].map( async (audioid: Number) => {
              const audioInfo = await getAudioInfo(audioid);
              return (
                <Grid item xs={12}>
                  <AudioCard
                    title={`Audio Set ${tracking}`}
                    soundfile={`http://localhost:3000/${audioInfo['filename']}`}
                  />
                </Grid>
              )
            })
        }
      </>
      <Typography
        align="center"
      >
          {audioInfo && audioInfo['script']}
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
          //onClick={sendResetPage(answersToQuestions, validatorID)}}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
