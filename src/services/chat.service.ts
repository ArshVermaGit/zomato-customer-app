/**
 * Chat Service
 * Simulates WebSocket connection for support chat
 */

import { ChatMessage } from '../types/chat.types';

type MessageCallback = (message: ChatMessage) => void;
type TypingCallback = (isTyping: boolean) => void;

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(() => resolve(true), ms));

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 'msg_init',
        text: 'Hi there! I\'m your virtual assistant. How can I help you today?',
        type: 'text',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        quickReplies: ['Order Issue', 'Payment Issue', 'Delivery Partner', 'Other']
    }
];

export const ChatService = {
    // Simulated listeners
    listeners: new Set<MessageCallback>(),
    typingListeners: new Set<TypingCallback>(),

    /**
     * Start a chat session
     */
    connect: async (_issueType: string): Promise<ChatMessage[]> => {
        await mockDelay(1000);
        return INITIAL_MESSAGES;
    },

    /**
     * Send a message
     */
    sendMessage: async (text: string, type: 'text' | 'image' = 'text', imageUrl?: string): Promise<ChatMessage> => {
        await mockDelay(500); // Network delay

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            text,
            type,
            imageUrl,
            sender: 'user',
            status: 'sent',
            timestamp: new Date().toISOString(),
        };

        // Trigger auto-reply simulation
        ChatService.simulateAutoReply(text);

        return newMessage;
    },

    /**
     * Subscribe to incoming messages
     */
    onMessage: (callback: MessageCallback) => {
        ChatService.listeners.add(callback);
        return () => ChatService.listeners.delete(callback);
    },

    /**
     * Subscribe to typing indicators
     */
    onTyping: (callback: TypingCallback) => {
        ChatService.typingListeners.add(callback);
        return () => ChatService.typingListeners.delete(callback);
    },

    /**
     * Simulate bot/agent logic
     */
    simulateAutoReply: async (userText: string) => {
        // 1. Bot receives -> Delivered
        await mockDelay(1000);
        // (In a real app, we'd update the user's message status here via a socket event, skipping for simplicity)

        // 2. Typing indicator
        ChatService.notifyTyping(true);
        await mockDelay(2000);
        ChatService.notifyTyping(false);

        // 3. Response
        const response: ChatMessage = {
            id: `msg_reply_${Date.now()}`,
            text: ChatService.generateResponse(userText),
            type: 'text',
            sender: 'agent',
            timestamp: new Date().toISOString(),
        };

        ChatService.broadcastMessage(response);
    },

    generateResponse: (text: string): string => {
        const lower = text.toLowerCase();
        if (lower.includes('order') || lower.includes('food')) return "I can help with that. Could you please provide your Order ID?";
        if (lower.includes('refund') || lower.includes('money')) return "Refunds are processed within 24-48 hours usually. Let me check the status for you.";
        if (lower.includes('hello') || lower.includes('hi')) return "Hello! How can I assist you today?";
        return "I see. Let me connect you with a support agent who can help you better.";
    },

    notifyTyping: (isTyping: boolean) => {
        ChatService.typingListeners.forEach(l => l(isTyping));
    },

    broadcastMessage: (msg: ChatMessage) => {
        ChatService.listeners.forEach(l => l(msg));
    }
};
