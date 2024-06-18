// import VideoCall from "@/components/VideoCall";
import "agora-react-uikit/dist/index.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const SDKVideoCall = dynamic(import("@/components/VideoCall"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen">
      <p>Loading....</p>
    </div>
  ),
});

const UIVideoCall = dynamic(import("@/components/UIVideoCall"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen">
      <p>Loading....</p>
    </div>
  ),
});

const appId = "bcbe8ec0346c48f9864327cb900f820c";

const CallIndex = () => {
  const { query } = useRouter();
  const { channel, token, uid } = query;
  return (
    <>
      {/* <SDKVideoCall appId={appId} channel={channel} token={token} /> */}
      <UIVideoCall appId={appId} channel={channel} token={token} uid={uid} />
    </>
  );
};

export default CallIndex;
