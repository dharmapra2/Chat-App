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
