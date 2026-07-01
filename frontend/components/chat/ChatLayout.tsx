"use client";

import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)]">

      <ChatSidebar />

      <div className="flex-1">

        <ChatWindow />

      </div>

    </div>
  );
}