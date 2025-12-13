/**
 * Chat Support Types
 */

export type MessageType = 'text' | 'image' | 'system';
export type SenderType = 'user' | 'agent' | 'bot';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
    id: string;
    text: string;
    type: MessageType;
    sender: SenderType;
    status?: MessageStatus;
    timestamp: string;
    imageUrl?: string;
    quickReplies?: string[];
}

export interface ChatSession {
    id: string;
    status: 'active' | 'closed';
    agentName?: string;
    agentAvatar?: string;
    issueType?: string;
}

export interface ChatState {
    messages: ChatMessage[];
    session: ChatSession | null;
    isTyping: boolean;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}
