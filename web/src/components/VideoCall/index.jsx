import React, { useState } from "react";

import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
  LocalVideoTrack,
  useRTCScreenShareClient,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  useRemoteVideoTracks,
  RemoteVideoTrack,
} from "agora-rtc-react";

import { useRouter } from "next/router";

const VideoCall = (props) => {
  const router = useRouter();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <div className="relative h-screen flex flex-col  justify-between bg-white">
        <div className="z-10 top-0 left-0 right-0 flex flex-col ">
          <Videos
            channel={props.channel}
            appId={props.appId}
            token={props.token}
            uid={props.uid}
            isScreenSharing={isScreenSharing}
            client={client}
          />
        </div>
        <div className="relative border-t h-16 z-20 w-screen flex justify-between items-center">
          <div className="px-4 font-semibold">{props.channel}</div>
          <div className="left-1/2 -translate-x-1/2 absolute space-x-3">
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className="px-5 py-3 h-12 text-base font-medium text-white bg-purple-600 rounded-2xl hover:bg-purple-700"
            >
              {isScreenSharing ? "Stop Sharing" : "Screen Share"}
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-3 h-12 text-base font-medium text-white bg-red-600 rounded-2xl hover:bg-red-700"
            >
              End Call
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </AgoraRTCProvider>
  );
};

const ScreenShare = ({ client }) => {
  const props = useLocalScreenTrack(true, {}, "auto", client);
  const { isLoading, screenTrack } = props;
  return (
    <AgoraRTCScreenShareProvider client={client}>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="h-80 w-80 relative">
          <LocalVideoTrack
            play={true}
            track={screenTrack}
            className="!z-0 absolute inset-0 w-full h-full aspect-video !rounded-2xl *:rounded-[inherit] border border-red-600 "
          />
        </div>
      )}
    </AgoraRTCScreenShareProvider>
  );
};

const Videos = (props) => {
  const { appId, channel, token, uid } = props;
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
    uid: uid,
  });

  audioTracks.map((track) => track.play());

  const deviceLoading = isLoadingMic || isLoadingCam;

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {deviceLoading ? (
        <div className="absolute flex items-center justify-center inset-0">
          Loading Devices...
        </div>
      ) : (
        <>
          <LocalVideoTrack
            play={true}
            track={localCameraTrack}
            className="!z-10 absolute !w-[200px] bottom-5 right-5 !h-[200px] !aspect-square !rounded-2xl *:rounded-[inherit]"
          />
          <div
            className={`grid !h-[calc(100vh-64px)] !w-screen grid-flow-col gap-2 overflow-auto rounded-xl p-2 `}
          >
            {remoteUsers.map((user) => {
              return (
                <RemoteUser
                  user={user}
                  className="!z-0 !aspect-square !h-full rounded-xl"
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
