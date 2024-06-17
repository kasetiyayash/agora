// import VideoCall from "@/components/VideoCall";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const VideoCall = dynamic(import("@/components/VideoCall"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen">
      <p>Loading....</p>
    </div>
  ),
});

const CallIndex = () => {
  const { query } = useRouter();

  const { channel, token } = query;
  return (
    <main className="flex w-full flex-col">
      <VideoCall
        appId={"bcbe8ec0346c48f9864327cb900f820c"}
        channel={channel}
        token={token}
      />
    </main>
  );
};

export default CallIndex;
