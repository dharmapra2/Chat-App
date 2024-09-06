import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GroupMemeberDialogProps } from "@/src/types/interfaces";

const GroupMembersDialog = ({
  selectedConversation,
}: GroupMemeberDialogProps) => {
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getMe, isAuthenticated ? undefined : "skip");

  const users = useQuery(api.users.getGroupMembers, {
    conversationId: selectedConversation._id,
  });
  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-xs text-muted-foreground text-left">See members</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-2">Current Members</DialogTitle>
          <DialogDescription>
            <section className="flex flex-col gap-3 ">
              {users?.map((user) => (
                <section
                  key={user._id}
                  className={`flex gap-3 items-center p-2 rounded`}
                >
                  <Avatar className="overflow-visible">
                    {user.isOnline && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground" />
                    )}
                    <AvatarImage
                      src={user.image}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback>
                      <span className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></span>
                    </AvatarFallback>
                  </Avatar>

                  <section className="w-full ">
                    <section className="flex items-center gap-2">
                      <h3 className="text-md font-medium">
                        {me?._id === user._id
                          ? "You"
                          : user.name || user.email.split("@")[0]}
                      </h3>
                      {user._id === selectedConversation.admin && (
                        <Crown size={16} className="text-yellow-400" />
                      )}
                    </section>
                  </section>
                </section>
              ))}
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default GroupMembersDialog;
