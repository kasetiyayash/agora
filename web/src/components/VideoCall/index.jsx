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
  const { appId, channel, token, isScreenSharing, client } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

  const getGridCols = (numUsers) => {
    if (numUsers === 1) return "grid-cols-1";
    if (numUsers <= 4) return "grid-cols-2";
    if (numUsers <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  const remoteUsers = useRemoteUsers();

  const gridColsClass = getGridCols(remoteUsers.length);

  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: appId,
    channel: channel,
    token: token,
  });

  audioTracks.map((track) => track.play());

  const deviceLoading = isLoadingMic || isLoadingCam;

  return (
    <div className="relative flex flex-col justify-between items-start w-full h-[calc(100vh-64px)] p-4">
      {deviceLoading ? (
        <div className="absolute flex items-center justify-center inset-0">
          Loading Devices...
        </div>
      ) : (
        <>
          <LocalVideoTrack
            play={true}
            track={localCameraTrack}
            className="!z-10 absolute !w-[200px] bottom-5 right-5 !h-[200px] aspect-video !rounded-2xl *:rounded-[inherit]"
          />

          <div className={`w-full flex flex-col gap-4`}>
            {/* {isScreenSharing && <ScreenShare client={client} />} */}
            <div className="h-60 w-60 relative col-span-1 border border-red-600">
              {remoteUsers.map((user) => {
                return (
                  <RemoteUser
                    user={user}
                    className="!z-0 absolute inset-0 w-full h-full aspect-video !rounded-2xl *:rounded-[inherit]"
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
