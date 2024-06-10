import SpinnerIcon from "@/icons/spinner";
import { useRouter } from "next/router";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), {
  ssr: false,
});

const appId = "bcbe8ec0346c48f9864327cb900f820c";

export default function Home() {
  const { replace, push } = useRouter();
  const [channel, setChannel] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState({});

  const [isHost, setHost] = useState(true);
  const [isPinned, setPinned] = useState(true);

  const [rtcProps, setRtcProps] = useState({});

  const getRtcToken = async ({ channelId = null }) => {
    const id = channelId ?? new Date().getTime()?.toString();
    return await fetch(`http://localhost:4000/token/rtc?channel=${id}&uid=${0}`)
      .then((res) => res.json())
      .then(({ key }) => {
        push({
          query: {
            token: key,
            channel: id,
            appId,
            // role: !channelId ? "host" : "audience",
            // layout: !channelId ? 1 : 0,
          },
          pathname: `/call/${id}`,
        });
      });
  };

  const handleChange = (event) => {
    setChannel(event.target.value);
    setError(false);
  };

  const handleJoin = async () => {
    try {
      setLoading({ join: true });
      if (channel) {
        setHost(false);
        setPinned(false);
        handleCreate({ channelId: channel });
      } else {
        setError(true);
        setLoading({});
      }
    } catch (error) {
      setLoading({});
      console.error("Join Call Error: ", error);
    }
  };

  const handleCreate = async ({ channelId }) => {
    try {
      setError(false);
      setLoading({ create: true });
      await getRtcToken({ channelId }).then(() => {
        setLoading({});
      });
    } catch (error) {
      setLoading({});
      console.log("Create Call Error: ", error);
    }
  };

  const styles = {
    container: { width: "100vw", height: "100vh", display: "flex", flex: 1 },
  };

  const callbacks = {
    EndCall: () => replace("/"),
  };

  return rtcProps?.token ? (
    <main style={styles.container}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </main>
  ) : (
    <main className="flex min-h-screen flex-col items-center gap-4 p-12 font-semibold text-black">
      <div className="space-y-4 w-full max-w-xl">
        <h1 className="text-2xl">Agora - Video Calling</h1>
        <section className="p-4 border-2 rounded-xl space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="channel" className="text-base">
              Channel
            </label>
            <input
              id="channel"
              value={channel}
              onChange={handleChange}
              placeholder="Enter Channel Id"
              className="px-4 h-12 rounded-xl border-2 placeholder:text-sm outline-none focus:border-black"
            />
            <p className={`text-xs text-red-600 ${error ? "block" : "hidden"}`}>
              Please enter channel id
            </p>
          </div>
          <div className="space-x-4 flex">
            <button
              className="px-4 h-12 bg-black text-white rounded-xl flex items-center justify-center gap-2"
              onClick={handleJoin}
            >
              {loading?.join && (
                <SpinnerIcon className="animate-spin w-5 h-5" />
              )}
              <p>Join Call</p>
            </button>
            <button
              className="px-4 h-12 bg-black text-white rounded-xl flex items-center justify-center gap-2"
              onClick={handleCreate}
            >
              {loading?.create && (
                <SpinnerIcon className="animate-spin w-5 h-5" />
              )}
              <p>Create Call</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
