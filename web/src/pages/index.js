import SpinnerIcon from "@/icons/spinner";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [channel, setChannel] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState({});

  const getRtcToken = async ({ channelId = null }) => {
    const id = channelId ?? new Date().getTime()?.toString();
    const accountId = Math.floor(Math.random() * 10000);
    return await fetch(
      `http://localhost:5000/token/rtc?channel=${id}&uid=${accountId}`
    )
      .then((res) => res.json())
      .then(({ key }) => ({ token: key, channel: id, accountId }));
  };

  const handleChange = (event) => {
    setChannel(event.target.value);
    setError(false);
  };

  const handleJoin = async () => {
    try {
      setLoading({ join: true });
      if (channel) {
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
      setLoading({ create: true });
      setError(false);
      const props = await getRtcToken({ channelId });
      const routes = {
        query: { ...props },
        pathname: "/call",
      };
      router.push({ ...routes }).then(() => {
        setLoading({});
      });
    } catch (error) {
      setLoading({});
      console.log("Create Call Error: ", error);
    }
  };

  return (
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
