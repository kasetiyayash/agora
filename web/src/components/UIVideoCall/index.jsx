import React, { useState } from "react";
import AgoraUIKit, { layout } from "agora-react-uikit";
import { useRouter } from "next/router";

const UIVideoCall = ({ appId, channel, token, uid }) => {
  const [isHost, setIsHost] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <AgoraUIKit
          rtcProps={{
            appId,
            channel,
            uid,
            token,
            role: isHost ? "host" : "audience",
            layout: isPinned ? layout.pin : layout.grid,
            screenshareUid: uid + 4,
            screenshareToken: token,
            enableScreensharing: true,
          }}
          styleProps={{}}
          rtmProps={{ username: "user", displayUsername: true }}
          callbacks={{
            EndCall: () => router.push("/"),
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flex: 1,
    backgroundColor: "#007bff22",
  },
  heading: { textAlign: "center", marginBottom: 0 },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  nav: { display: "flex", justifyContent: "space-around" },
  btn: {
    backgroundColor: "#007bff",
    cursor: "pointer",
    borderRadius: 5,
    padding: "4px 8px",
    color: "#ffffff",
    fontSize: 20,
  },
  input: { display: "flex", height: 24, alignSelf: "center" },
};

export default UIVideoCall;
