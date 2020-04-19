import * as React from 'react';
import { VideoStream } from 'utils/VideoClient';
import Log from 'utils/Log';

export interface IVideoPlayerProps {
    videoStream: VideoStream;
}

export default class VideoPlayer extends React.Component<IVideoPlayerProps> {

    streamId: string;
    stream: AgoraRTC.Stream;
    constructor(props: IVideoPlayerProps) {
        super(props);
        this.stream = props.videoStream.stream;
        this.streamId = this.stream.getId().toString();
    }
    componentDidMount() {
        if (this.stream.isPlaying() === false) {
            this.stream.play(`video-${this.streamId}`, { fit: "contain" }, async error => {
                if (error) {
                    Log.Error(error);
                    if (error?.status === "aborted") {
                        this.stream.resume();
                    }
                }
            });
        }
    }

    public render() {
        return (
            <div id={`video-${this.streamId}`}>
            </div>
        );
    }
}
