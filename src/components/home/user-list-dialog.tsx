"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, MessageSquareDiff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/src/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationParams } from "@/src/types/interfaces";
import { Id } from "@/convex/_generated/dataModel";

const UserListDialogContent = () => {
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [renderedImage, setRenderedImage] = useState("");

  const imgRef = useRef<HTMLInputElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedImage) return setRenderedImage("");
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  const createConversation = useMutation(api.conversations.createConversation);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const me = useQuery(api.users.getMe);
  const users = useQuery(api.users.getUsers);

  const handleCreateConversations = async () => {
    if (selectedUsers.length === 0) return;
    try {
      setIsLoading(true);
      const isGroup = selectedUsers.length > 1;
      if (!isGroup) {
        const { ConversationId, messages, status } = await createConversation({
          participants: [...selectedUsers, me?._id!],
          isGroup: false,
        });
        status != "exits" ? toast.success(messages) : toast.error(messages);
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
        status != "exits" ? toast.success(messages) : toast.error(messages);
      }
      dialogCloseRef.current?.click();
      setSelectedUsers([]);
      setGroupName("");
      setSelectedImage(null);

      // TODO: update the global state called `selectedConversations`.
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Failed to create conversations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>USERS</DialogTitle>
        <DialogClose ref={dialogCloseRef} />
      </DialogHeader>
      <DialogDescription>Start a new chat</DialogDescription>
      {renderedImage && (
        <div className="w-16 h-16 relative mx-auto">
          <Image
            src={renderedImage}
            fill
            loading="lazy"
            alt="user image"
            className="rounded-full object-cover"
          />
        </div>
      )}
      <input
        type="file"
        name="selected_image"
        accept="image/*"
        ref={imgRef}
        hidden
        onChange={(e) => setSelectedImage(e.target.files![0])}
      />
      {selectedUsers.length > 1 && (
        <>
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button
            className="flex gap-2"
            onClick={() => imgRef.current?.click()}
          >
            <ImageIcon size={20} />
            Group Image
          </Button>
        </>
      )}
      <div className="flex flex-col gap-3 overflow-auto max-h-60">
        {users?.map((user) => (
          <div
            key={user._id}
            className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
                transition-all ease-in-out duration-300 ${
                  selectedUsers.includes(user._id) ? "bg-green-primary" : ""
                }`}
            onClick={() => {
              setSelectedUsers((prevSelectedUsers) =>
                prevSelectedUsers.includes(user._id)
                  ? prevSelectedUsers.filter((id) => id !== user._id)
                  : [...prevSelectedUsers, user._id]
              );
            }}
          >
            <Avatar className="overflow-visible">
              {user.isOnline && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground" />
              )}
              <AvatarImage
                src={user.image}
                loading="lazy"
                className="rounded-full object-cover"
              />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="text-md font-medium">
                  {user.name || user.email.split("@")[0]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant={"outline"}
          onClick={() => dialogCloseRef.current?.click()}
        >
          Cancel
        </Button>
        <Button
          disabled={
            selectedUsers.length === 0 ||
            (selectedUsers.length > 1 && !groupName) ||
            isLoading
          }
          onClick={handleCreateConversations}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

const UserListDialog = () => {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return <MessageSquareDiff size={20} />;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <MessageSquareDiff size={20} />
      </DialogTrigger>
      <UserListDialogContent />
    </Dialog>
  );
};

export default UserListDialog;
