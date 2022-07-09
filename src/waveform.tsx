import { MutableRefObject, useEffect, useRef, FC } from 'react';
import WaveSurfer from 'wavesurfer.js';
// Credit: https://dev.to/jamland/audio-player-with-wavesurfer-js-react-1g3b
// Parts of this code was created following the tutorial ^

/**
 * Displays audio waveform and plays audio
 */

const formWaveSurferOptions = (ref: any) => ({
    container: ref,
    waveColor: '#eee',
    progressColor: 'OrangeRed',
    cursorColor: 'OrangeRed',
    barWidth: 3,
    barRadius: 3,
    responsive: true,
    height: 150,
    normalize: true,
    partialRender: true,
});

interface WaveformProps {
    file: string;
    isPlaying: boolean;
    audioFinished?: () => void;
}

const Waveform: FC<WaveformProps> = ({ file, isPlaying, audioFinished }) => {
    const waveformRef = useRef() as MutableRefObject<HTMLDivElement>;
    const wavesurfer = useRef() as MutableRefObject<any>;

    useEffect(() => {
        // create new WaveSurfer instance
        // On component mount and when url changes
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);

        // callback when audio is done playing
        wavesurfer.current.on('finish', function () {
            if (audioFinished) {
                audioFinished();
            }
        });

        wavesurfer.current.load(file);

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, [file, audioFinished]);

    // Triggers playing/pausing when prop changes
    useEffect(() => {
        if (isPlaying) {
            wavesurfer.current.play();
        } else {
            wavesurfer.current.pause();
        }
    }, [isPlaying]);

    return (
        <div>
            <div id="waveform" ref={waveformRef} />
        </div>
    );
};

export default Waveform;