import { Id } from "@/convex/_generated/dataModel";

export interface ConversationParams {
  participants: Id<"users">[];
  isGroup: boolean;
  groupName: string;
  admin: Id<"users"> | undefined;
  groupImage?: Id<"_storage">;
}
