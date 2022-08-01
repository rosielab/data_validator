import { Card, CardActions, IconButton, Typography } from '@mui/material';
import Waveform from './waveform';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { useCallback, useState, FC } from 'react';

/**
 * Plays and displays audio wave
 */

interface AudioCardProps {
    title: string;
    soundfile: string; // location of audio file
}

enum AudioState {
    Play,
    Pause,
}

const AudioCard: FC<AudioCardProps> = ({ title, soundfile }) => {
    const [audioState, setAudioState] = useState(AudioState.Pause);

    const playAudio = useCallback(() => {
        setAudioState(AudioState.Play);
    }, []);

    const pauseAudio = useCallback(() => {
        setAudioState(AudioState.Pause);
    }, []);

    const PlayButton = () => (
        <IconButton onClick={playAudio}>
            <PlayCircleFilledIcon />
        </IconButton>
    );

    const PauseButton = () => (
        <IconButton onClick={pauseAudio}>
            <PauseCircleIcon />
        </IconButton>
    );

    const audioFinished = useCallback(() => {
        pauseAudio();
    }, [pauseAudio]);

    return (
        <Card sx={{ backgroundColor: 'black' }}>
            <Waveform
                file={soundfile}
                isPlaying={audioState === AudioState.Play}
                audioFinished={audioFinished}
            />
            <CardActions
                disableSpacing
                sx={{
                    backgroundColor: 'primary.dark',
                    color: 'white',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                <Typography fontWeight="500">{title}</Typography>
                {audioState === AudioState.Pause ? (
                    <PlayButton />
                ) : (
                    <PauseButton />
                )}
            </CardActions>
        </Card>
    );
};

export default AudioCard;
