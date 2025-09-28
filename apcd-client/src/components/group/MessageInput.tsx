// src/components/group/MessageInput.tsx
import React, { useState } from "react";
import Button from "../ui/button";

interface MessageInputProps {
  onSend: (contenu: string) => void;
  isMember: boolean; // Si false, on bloque l’envoi
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isMember }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    if (!isMember) return alert("Vous devez être membre pour envoyer un message !");
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center p-3 border-t bg-white">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2 mr-2"
        placeholder={isMember ? "Écrire un message..." : "Rejoignez le groupe pour envoyer un message"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isMember}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <Button onClick={handleSend} disabled={!isMember}>
        Envoyer
      </Button>
    </div>
  );
};

export default MessageInput;
