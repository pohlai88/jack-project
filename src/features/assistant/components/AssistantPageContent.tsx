'use client';

import type { UIMessage } from 'ai';
import { useCallback, useState } from 'react';

import { ChatInterface } from './ChatInterface';
import { ConversationList } from './ConversationList';
import type { InitialDataResponse } from '../types';

interface AssistantPageContentProps {
  initialData: InitialDataResponse;
  conversationId?: string | null;
  initialMessages?: UIMessage[];
  initialTitle?: string;
}

export function AssistantPageContent({
  initialData,
  conversationId,
  initialMessages,
  initialTitle: _initialTitle,
}: AssistantPageContentProps) {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const handleConversationCreated = useCallback(() => {
    setRefetchTrigger((n) => n + 1);
  }, []);

  return (
    <div className="flex h-full overflow-hidden border-t bg-card">
      <ConversationList currentConversationId={conversationId} refetchTrigger={refetchTrigger} />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatInterface
          id={conversationId ?? undefined}
          initialMessages={initialMessages}
          welcomeMessage={initialData.welcomeMessage}
          suggestedQuestions={initialData.suggestedQuestions}
          capabilities={initialData.capabilities}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  );
}
