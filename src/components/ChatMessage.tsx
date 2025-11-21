import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 animate-in fade-in-0 slide-in-from-bottom-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser ? "bg-chat-user text-chat-user-foreground" : "bg-chat-ai text-chat-ai-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl px-4 py-3 max-w-[80%]",
          isUser
            ? "bg-chat-user text-chat-user-foreground ml-auto"
            : "bg-chat-ai text-chat-ai-foreground"
        )}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
