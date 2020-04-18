import AgoraRTC from "agora-rtc-sdk";
import Log from "./Log";

export default class VideoClient {

    appId: string;
    client: AgoraRTC.Client;
    streamList: Array<AgoraRTC.Stream>;
    localStream: AgoraRTC.Stream;
    onStreamListChanged: (streamList: Array<AgoraRTC.Stream>) => void;
    onLocalStreamChanged: (stream: AgoraRTC.Stream) => void;
    constructor(appId: string) {
        this.appId = appId;
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
        this.streamList = [];
        this.localStream = {} as AgoraRTC.Stream;
        this.onStreamListChanged = {} as (streamList: Array<AgoraRTC.Stream>) => void;
        this.onLocalStreamChanged = {} as (stream: AgoraRTC.Stream) => void;
    }


    public async create(channel: string, uid: string) {
        await this.initial();
        await this.subscribeEvents();
        await this.joinChannel(channel, uid);
        let stream = await this.createStream(uid);
        this.localStream = stream;
        this.streamList.push(stream);
        this.onStreamListChanged(this.streamList);
        // this.onLocalStreamChanged(this.localStream);
        this.onLocalStreamChanged(this.localStream);
        await this.publishStream(stream);
    }

    private initial(): Promise<AgoraRTC.Client> {
        return new Promise<AgoraRTC.Client>(resolve => {
            this.client.init(this.appId, () => {
                Log.Info("AgoraRTC client initialized");
                resolve(this.client);
            }, (error: any) => {
                Log.Warning(error);
            })
        })
    }
    private subscribeEvents() {
        this.client.on('stream-added', evt => {
            let stream = evt.stream;
            if (stream.getId() !== this.localStream.getId()) {
                this.client.subscribe(stream, {}, error => {
                    Log.Warning(error);
                })
            }
        });

        this.client.on('stream-subscribed', evt => {
            let stream = evt.stream;
            this.streamList.push(stream);
            this.onStreamListChanged(this.streamList);
        });

        this.client.on("stream-removed", evt => {
            let stream = evt.stream
            this.streamList = this.streamList.filter(p => p.getId() !== stream.getId());
            this.onStreamListChanged(this.streamList);
        })

        this.client.on('peer-leave', evt => {
            this.streamList = this.streamList.filter(p => p.getId().toString() !== evt.uid);
            this.onStreamListChanged(this.streamList);
        })


    }

    private joinChannel(channel: string, uid: string): Promise<string> {
        return new Promise<string>(resolve => {
            this.client.join(this.appId, channel, uid, uid => resolve(uid.toString()), error => {
                Log.Warning(error);
            })

        })
    }

    private createStream(uid: string): Promise<AgoraRTC.Stream> {
        return new Promise<AgoraRTC.Stream>(resolve => {
            let defaultConfig = {
                streamID: uid,
                audio: true,
                video: true,
                screen: false
            }
            let stream = AgoraRTC.createStream(defaultConfig);
            stream.setVideoProfile('720p');
            stream.init(() => {
                resolve(stream);
            }, error => {
                Log.Warning(error);
            })
        })
    }

    private publishStream(stream: AgoraRTC.Stream): Promise<void> {
        return new Promise<void>(resolve => {
            this.client.publish(stream, err => {
                Log.Warning(err);
            })
            resolve();
        });

    }
}