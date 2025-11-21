import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";

const Index = () => {
  const { messages, sendMessage, isLoading } = useStreamingChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">SalesPro</h1>
            <p className="text-sm text-muted-foreground">
              Your Expert Product Recommendation Assistant
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold">
                Welcome to SalesPro!
              </h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                I'm your recommendation assistant. Tell me what you're looking for, 
                and I'll suggest the best options based on your needs, budget, and preferences.
              </p>
              <div className="grid gap-3 text-left">
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm font-medium">Example queries:</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• "I need a laptop for video editing under $2000"</li>
                    <li>• "What's the best smartphone for photography?"</li>
                    <li>• "Compare budget vs premium noise-canceling headphones"</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="mx-auto w-full max-w-4xl">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
