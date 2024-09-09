"use client";

import { randomID } from "@/src/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter in app directory

// Utility function to parse URL params
export function getUrlParams(url: string): URLSearchParams {
  const urlStr = url.split("?")[1] || "";
  return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useClerk();
  const router = useRouter();
  const roomID =
    getUrlParams(window.location.href).get("roomID") || randomID(5);

  // Use ref to store the container element
  const meetingContainerRef = useRef<HTMLDivElement>(null);

  const myMeeting = async (element: HTMLDivElement) => {
    try {
      const res = await fetch(`/api/zegocloud?userID=${user?.id}`);

      if (!res.ok) {
        console.error(`Fetch failed with status: ${res.status}`);
        router.push("/"); // Redirect if the request fails
        return;
      }

      const responseData = await res.json();
      console.log(`responseData:`, responseData);
      const { token, appID, errorCode } = responseData;

      if (errorCode) {
        router.push("/"); // Redirect on API error
        return;
      }

      const username =
        user?.fullName || user?.emailAddresses[0].emailAddress.split("@")[0];

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        roomID,
        user?.id!,
        username
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        showPreJoinView: false,
        showTextChat: false,
        showUserList: false,
        showOnlyAudioUser: true,
        enableUserSearch: false,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // Group call mode
        },
      });
    } catch (error) {
      console.error("Error during fetch or JSON parsing:", error);
    }
  };

  useEffect(() => {
    if (!router || !user?.id) return;

    setIsMounted(true);

    // Call the meeting logic after the component is mounted and ref is ready
    if (meetingContainerRef.current) {
      myMeeting(meetingContainerRef.current);
    }
  }, [router, user?.id]); // Wait for router and user to be ready

  return isMounted ? (
    <div
      className="myCallContainer"
      ref={meetingContainerRef} // Set the ref here
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  ) : (
    <div>Loading...</div>
  );
}
