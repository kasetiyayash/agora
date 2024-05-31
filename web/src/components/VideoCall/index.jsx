import { useRouter } from "next/router";
import React, { useState } from "react";

const rtcProps = {
  appId: "bcbe8ec0346c48f9864327cb900f820c",
  channel: "<Channel name>",
  token: "<Your channel token>",
};

const VideoCall = () => {
  const { query } = useRouter();
  console.log("query: ", query);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-12 font-semibold border-2 border-black">
      VideoCall
    </main>
  );
};

export default VideoCall;
