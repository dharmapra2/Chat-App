import React from "react";
import { ListFilter, Search } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitcher";
import { Input } from "@/src/components/ui/input";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";

const ConversationComponent = dynamic(
  () => import("@/src/components/home/ParentConversation"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const UserListDialog = dynamic(
  () => import("@/src/components/home/user-list-dialog"),
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
            <UserListDialog />
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
      <ConversationComponent />
    </aside>
  );
};

export default LeftPanel;
