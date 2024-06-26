import React from "react";
import { ListFilter, MessageSquareDiff, Search } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitcher";
import { Input } from "@/src/components/ui/input";
import { conversations } from "@/src/dummyData/db";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "@/src/components/home/user-list-dialog";

const ConversationComponent = dynamic(
  () => import("@/src/components/conversation"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const LeftPanel = () => {
  return (
    <aside className="w-1/4 border-gray-600 border-r">
      <nav className="sticky top-0 bg-left-panel z-10">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3 items-center">
          <div className="flex">
            <UserButton />
          </div>
          <div className="flex items-center gap-3">
            {/* <MessageSquareDiff size={20} /> */}
            <UserListDialog />
            {/* TODO: This line will be replaced with <UserListDialog /> */}
            <ThemeSwitch />
          </div>
        </div>
        <div className="p-3 flex items-center">
          {/* Search */}
          <div className="relative h-10 mx-3 flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search or start a new chat"
              className="pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent"
            />
          </div>
          <ListFilter className="cursor-pointer" />
        </div>
      </nav>

      {/* Chat List */}
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
            <ConversationComponent
              key={conversation?._id}
              conversation={conversation}
            />
          ))
        )}
      </section>
    </aside>
  );
};

export default LeftPanel;
