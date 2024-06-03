import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), {
  ssr: false,
});

const VideoCall = () => {
  const { query, push } = useRouter();

  console.log("query: ", query);

  const { channel, token } = query || {};

  const hasWindow = typeof window !== "undefined";

  // const rtcProps = {
  //   appId: "bcbe8ec0346c48f9864327cb900f820c",
  //   channel: "1717220365710",
  //   token:
  //     "007eJxTYLANEvrGvbSU+cPqWYkf2C++T64vW7PaecbSy8Zp145yK61XYEhKTkq1SE02MDYxSzaxSLO0MDMxNjJPTrI0MEizMDJIztwaldYQyMjAGfObgREKQXxeBkNzQ3MjIwNjM1NzQwMGBgCPCiCy",
  // };
  const rtcProps = {
    appId: "bcbe8ec0346c48f9864327cb900f820c",
    channel,
    token,
  };

  const styles = {
    container: { width: "100vw", height: "100vh", display: "flex", flex: 1 },
  };

  const callbacks = {
    EndCall: () => push("/"),
  };

  return (
    rtcProps?.token && (
      <main style={styles.container}>
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      </main>
    )
  );
};

export default VideoCall;
