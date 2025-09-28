// src/components/group/MessageList.tsx
import React, { useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";

interface Message {
  id: number;
  userId: number;
  nom: string;
  avatar?: string | null;
  contenu: string;
  type: "texte" | "image" | "video" | "fichier";
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique en bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
      {messages.map((msg) => {
        const isMe = msg.userId === currentUserId;
        return (
          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            {!isMe && <Avatar src={msg.avatar} size={35} />}
            <div
              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.type === "texte" && <span>{msg.contenu}</span>}
              {msg.type === "image" && <img src={msg.contenu} className="rounded w-40" />}
              {msg.type === "video" && (
                <video src={msg.contenu} controls className="rounded w-40" />
              )}
              {msg.type === "fichier" && (
                <a href={msg.contenu} target="_blank" rel="noopener noreferrer" className="underline">
                  Fichier
                </a>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;
