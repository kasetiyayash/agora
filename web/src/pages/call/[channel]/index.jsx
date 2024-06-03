// import VideoCall from "@/components/VideoCall";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const VideoCall = dynamic(import("@/components/VideoCall"), {
  ssr: false,
  loading: () => <p>Loading....</p>,
});

const CallIndex = () => {
  const { query } = useRouter();

  const { channel, token } = query;
  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {channel}
      </p>
      <VideoCall
        appId={"bcbe8ec0346c48f9864327cb900f820c"}
        channel={channel}
        token={token}
      />
    </main>
  );
};

export default CallIndex;
