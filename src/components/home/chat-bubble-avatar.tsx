import { messages } from "@/src/dummyData/db";
import React from "react";
import { IMessage } from "@/src/types/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ChatBubbleAvatarProps = {
  message: IMessage;
  isMember: boolean;
  isGroup: boolean | undefined;
  fromAI: boolean | undefined;
};

function ChatBubbleAvatar({
  message,
  isMember,
  isGroup,
}: ChatBubbleAvatarProps) {
  if (!isGroup) {
    return null;
  }
  return (
    <Avatar className="overflow-visible relative">
      {message.sender.isOnline && isMember && (
        <div className="absolute top-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-foreground"></div>
      )}
      <AvatarImage
        src={message?.sender?.image}
        className="rounded-full object-cover size-8"
      />
      <AvatarFallback className="size-8">
        <div className="animate-pulse bg-gray-tertiary rounded-full"></div>
      </AvatarFallback>
    </Avatar>
  );
}

export default ChatBubbleAvatar;
