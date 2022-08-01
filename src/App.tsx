import React, { useEffect } from 'react';
import './App.css';
import BubbleQuestion from "./components/bubble"
import SliderQuestion from "./components/slider"
import { Grid, Button, Typography, TextField, Alert } from '@mui/material';
import AudioCard from './components/audiocard';
import questionInfo from "./config.json";

function App() {

  const num_samples = questionInfo["num_samples"];

  const initQuestions = () => {
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
      question0:'false',
      ...tempanswers
    })
  };

  const isSelected = () => {
      for (var key in answersToQuestions){
        // @ts-ignore
        if (answersToQuestions["question0"] == 'true' && (answersToQuestions[key] === "" || answersToQuestions[key] === [] || answersToQuestions[key] === 0)) {
          return(true)
        }
      }
      return(false)
  };

  const getAudioList = async (validatorid: Number) => {
    try{
      const response = await fetch(`http://localhost:4000/init?validatorid=${validatorid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      alert(error);
    }
  }

  const getAudioInfo = async (audioid: Number) => {
    try{
      const response = await fetch(`http://localhost:4000/audio?audioid=${audioid}`);
      const audiolist = await response.json();
      return audiolist;
    }catch (error) {
      alert(error);
    }
  }

  const getAudioFiles = async (audiolist: Array<number>) => {
    const audioFiles: Array<Blob> = [];
    for (const audioitem of audiolist) {
      try{
        //@ts-ignore
        const response = await fetch(`http://localhost:4000/file?folder=${audioitem['file_name'].replace('.wav','')}&path=${audioitem['chunk_name']}`);
        const audioblob = await response.blob();
        audioFiles.push(audioblob);
      }catch (error) {
        alert(error);
      }
    }
    return audioFiles;
  }

  const sendId = async (validatorID: Number) => {
    try{
      const response = await fetch('http://localhost:4000/user', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validatorID,
        }),
      })
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error);
    }
  }


  const sendResponse= async (responses: Array<any>)  => {
    try{
      const response = await fetch('http://localhost:4000/responses', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses
        }),
      })
      if (!response.ok) throw await response.json();
      const data = await response.json();
      return data;
    } catch (error) {
      alert("Something went wrong, check console for details");
    }
  }

  const [answersToQuestions, setAnswersToQuestions] = React.useState({
    "question0": ""
  });

  const [validatorID, setValidatorId] = React.useState(0);

  const [textValue, setTextValue] = React.useState('');

  const [audioListState, setAudioList] = React.useState([[]] as Array<Array<object>>);

  const [tracking, setTracking] = React.useState(0 as number);

  const [audioFiles, setAudioFiles] = React.useState([] as Array<Blob>);

  useEffect(() => {
    initQuestions();
  }, []);

  useEffect(() => {
    //@ts-ignore
    getAudioFiles(audioListState[tracking]).then(audioFiles => {
      //@ts-ignore
      setAudioFiles(audioFiles);
    });
  }, [tracking]);

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
              const audioList: Array<Array<object>> = [];
              let tempArray: Array<object> = [];
              for (const obj of audioObject ) {
                // @ts-ignore
                let tempAudioInfo = await getAudioInfo(obj['id']);
                if (tempArray.length === num_samples) {
                  audioList.push(tempArray);
                  tempArray = [];
                }
                tempArray.push(tempAudioInfo[0]);
              }
              if (tempArray.length) {
                audioList.push(tempArray as Array<Number>);
              }
              if (audioList.length) {
                setAudioList(audioList);
                //@ts-ignore
                const audioFileList = await getAudioFiles(audioList[tracking]);
                //@ts-ignore
                setAudioFiles(audioFileList);
              } else {
                // the validator has finished all files
                setAudioList([]);
              }
            }}>
              Submit
          </Button>
        </Grid>
      </Grid>
    );
  }
  if (!audioListState.length || (tracking+1) > audioListState.length) {
    return (
      <div>
        You have completed your audio validation!
      </div>
    );
  }
  else if (audioFiles.length){
    return (
      // @ts-ignore
      <Grid>
        {
          audioListState[tracking].map((audioelem: object, idx) => {
            return(
              <Grid item xs={12} key={idx}>
                <AudioCard
                  title={`Audio Set ${idx}`}
                  //@ts-ignore
                  soundfile={audioFiles[idx]}
                />
                <Typography
                  align="center"
                  key={idx}
                  >
                    {
                      //@ts-ignore
                      audioelem['script']
                    }
                </Typography>
              </Grid>
            )
          })
        }
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
            choice_list={[{"Yes":true},{"No":false}]}
            required={true}
            // @ts-ignore
            value={answersToQuestions[`question0`]}
            question_id={`question0`}
            handleChange={(event) => {handleChangeToAnswerToQuestions(event, "question0")}}
          />
          </Grid>
          {
            answersToQuestions['question0'] == 'true' && questionInfo["question_info"].map((question, idx) => {
              if (question["type"] === "bubble") {
                return(
                  <Grid 
                    item
                    key={idx}
                  >
                    <BubbleQuestion
                      key={idx}
                      question_name={question["data"]["question_name"]}
                      // @ts-ignore
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
            onClick={
              async () => {
                let responseList: Array<Number> = [];
                audioListState[tracking].forEach((audioelem: object) => {
                  //@ts-ignore
                  responseList.push(audioelem['id']);
                })
                responseList.push(validatorID);
                Object.keys(answersToQuestions).forEach((response: String) => {
                  //@ts-ignore
                  responseList.push(answersToQuestions[response]);
                })
                await sendResponse(responseList);
                initQuestions();
                setTracking(tracking+1);
              }
            }
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    )
  };
  // To render when loading audio files
  return (null);
}

export default App;
