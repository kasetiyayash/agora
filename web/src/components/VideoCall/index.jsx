import React from "react";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from "next/link";

const VideoCall = (props) => {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  return (
    <AgoraRTCProvider client={client}>
      <div className="relative h-screen flex flex-col  justify-between bg-black">
        <div className="z-10 top-0 left-0 right-0 flex flex-col ">
          <Videos
            channel={props.channel}
            appId={props.appId}
            token={props.token}
          />
        </div>
        <div className="h-24 w-screen flex justify-center">
          <button className="px-5 py-3 text-base font-medium text-white bg-red-400 rounded-2xl hover:bg-red-500">
            End Call
          </button>
        </div>
      </div>
    </AgoraRTCProvider>
  );
};

const Videos = (props) => {
  const { appId, channel, token } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: appId,
    channel: channel,
    token: token,
  });
  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );
  return (
    <div className="flex flex-col justify-between items-start w-full h-[calc(100vh-48px)] p-4">
      <div
        className={`h-full w-full grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        }}
      >
        <LocalVideoTrack
          play={true}
          track={localCameraTrack}
          className="!z-10 absolute !w-[200px] bottom-5 right-5 !h-[200px] aspect-video !rounded-2xl *:rounded-[inherit]"
        />
        {remoteUsers.map((user) => (
          <RemoteUser
            user={user}
            className="!z-0 w-full h-full aspect-video !rounded-2xl *:rounded-[inherit]"
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCall;
