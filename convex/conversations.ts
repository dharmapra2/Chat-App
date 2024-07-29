import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createConversation = mutation({
  args: {
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.id("_storage")),
    admin: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log(`identity:  `, identity);
    if (!identity) throw new ConvexError("Unauthorized");
    const existingConversion = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("participants"), args.participants),
          q.eq(q.field("participants"), args.participants.reverse())
        )
      )
      .first();
    console.log(`existingConversion: `, existingConversion);
    if (existingConversion) {
      return {
        ConversationId: existingConversion._id,
        messages: "Conversations is alredy exits.",
        status: "exits",
      };
    }

    let groupImage;
    if (args.groupImage) {
      groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
    }
    const conversationId = await ctx.db.insert("conversations", {
      participants: args.participants,
      isGroup: args.isGroup,
      groupName: args.groupName,
      groupImage,
      admin: args.admin,
    });
    return {
      ConversationId: conversationId,
      messages: "Conversations is created sucessfully.",
      status: "new",
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  // A url that allows file upload via an HTTP POST
  return await ctx.storage.generateUploadUrl();
});
