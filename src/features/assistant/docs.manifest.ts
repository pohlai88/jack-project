import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'assistant',
  title: 'AI Assistant',
  module: 'Member Productivity',
  owner: 'ai-platform',
  releaseState: 'released',
  summary: 'Tenant-aware AI assistant conversations and generated UI responses.',
  routes: ['/t/[tenant]/assistant', '/api/assistant/conversations', '/api/assistant/conversations/[id]', '/api/chat'],
  permissions: [],
  workflows: [
    {
      id: 'assistant.chat-session',
      title: 'Assistant conversation',
      summary: 'Members ask questions and receive contextual assistant responses for tenant data.',
    },
  ],
  actions: [
    {
      id: 'assistant.start-conversation',
      title: 'Start assistant conversation',
      summary: 'Create or continue a conversation in the tenant assistant workspace.',
    },
  ],
  apis: [
    {
      id: 'assistant.chat',
      method: 'POST',
      route: '/api/chat',
      summary: 'Send chat messages to the assistant runtime.',
    },
    {
      id: 'assistant.conversations',
      method: 'GET',
      route: '/api/assistant/conversations',
      summary: 'List assistant conversations.',
    },
  ],
  errors: [
    {
      code: 'AFD-AI-CONVERSATION-LOAD',
      title: 'Conversation cannot be loaded',
      mitigation: 'Confirm tenant context, conversation ownership, and assistant service availability.',
    },
  ],
  troubleshooting: [
    {
      id: 'assistant.no-response',
      title: 'Assistant does not respond',
      symptom: 'The chat interface does not produce a response.',
      resolution: 'Check model provider settings, tenant AI configuration, and server logs for provider errors.',
    },
  ],
});
