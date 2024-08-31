import { messages } from "@/src/dummyData/db";
import { Id } from "@/convex/_generated/dataModel";

export interface ConversationParams {
  participants: Id<"users">[];
  isGroup: boolean;
  groupName: string;
  admin: Id<"users"> | undefined;
  groupImage?: Id<"_storage">;
}

export type Conversations = {
  _id: Id<"conversations">;
  image?: string;
  participants: Id<"users">[];
  isGroup?: boolean;
  name?: string;
  admin?: Id<"users">;
  groupName?: string;
  groupImage?: string;
  isOnline: boolean;
  _creationTime: number;
  lastMessage: {
    _id: Id<"messages">;
    conversation: Id<"conversations">;
    content: string;
    sender: Id<"users">;
  };
};
export type GroupMemeberDialogProps = {
  selectedConversation: Conversations;
};

export interface IMessage {
  _id: Id<"messages">;
  content: string;
  _creationTime: number;
  messageType: "text" | "image" | "video";
  sender: {
    _id: Id<"users">;
    image: string;
    name?: string;
    tokenIdentifier: string;
    email: string;
    _creationTime: number;
    isOnline: boolean;
  };
}

export interface chatBubbleProps {
  message: IMessage;
  me: any;
}

export interface DateIndicatorProps {
  message: IMessage;
  previousMessage?: IMessage;
}

export interface ChatBubbleProps {
  message: IMessage;
  me: any;
  previousMessage?: IMessage;
}
