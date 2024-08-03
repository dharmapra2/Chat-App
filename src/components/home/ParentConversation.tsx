"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import dynamic from "next/dynamic";

const Conversation = dynamic(() => import("@/src/components/conversation"), {
  loading: () => <div> Conversation Loading...</div>,
});

function ParentConversation() {
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getMe, isAuthenticated ? undefined : "skip");
  const conversations = useQuery(
    api.conversations.getMyConversations,
    isAuthenticated ? undefined : "skip"
  );

  return (
    <section className="my-3 flex flex-col gap-0 max-h-[80%] overflow-auto">
      {/* Conversations will go here*/}
      {conversations?.length === 0 ? (
        <>
          <p className="text-center text-gray-500 text-sm mt-3">
            No conversations yet
          </p>
          <p className="text-center text-gray-500 text-sm mt-3 ">
            We understand {"you're"} an introvert, but {"you've"} got to start
            somewhere 😊
          </p>
        </>
      ) : (
        // Chat List
        conversations?.map((conversation) => (
          <Conversation
            key={conversation?._id}
            conversation={conversation}
            me={me}
          />
        ))
      )}
    </section>
  );
}

export default ParentConversation;
