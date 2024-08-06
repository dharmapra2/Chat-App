import { Conversations } from "@/src/types/interfaces";
import { create } from "zustand";

type ConversationStore = {
  selectedConversation: Conversations | null;
  setSelectedConversation: (conversations: Conversations | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversations) =>
    set({ selectedConversation: conversations }),
}));
