"use server";

import { Id } from "@/convex/_generated/dataModel";
import { ConversationParams } from "../types/interfaces";

export const handleCreateConversations = async (params: {
  selectedUsers: any;
  me: any;
  groupName: any;
  selectedImage: any;
  generateUploadUrl: any;
  createConversation: any;
}) => {
  const {
    selectedUsers,
    me,
    groupName,
    selectedImage,
    generateUploadUrl,
    createConversation,
  } = params;

  try {
    const isGroup = selectedUsers.length > 1;
    if (!isGroup) {
      const { ConversationId, messages, status } = await createConversation({
        participants: [...selectedUsers, me?._id!],
        isGroup: false,
      });
      return { ConversationId, messages, status };
    } else {
      let temp_storageId: ConversationParams = {
        participants: [...selectedUsers, me?._id!].sort(),
        isGroup: true,
        groupName,
        admin: me?._id,
      };

      if (selectedImage) {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage!.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();
        temp_storageId.groupImage = storageId as Id<"_storage">;
      }
      const { ConversationId, messages, status } =
        await createConversation(temp_storageId);
      return { ConversationId, messages, status };
    }
  } catch (error) {
    throw new Error(`Failed to create conversations: ${error}`);
  }
};
