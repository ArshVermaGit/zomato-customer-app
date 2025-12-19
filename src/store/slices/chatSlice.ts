/**
 * Chat Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types/chat.types';
import { ChatService } from '../../services/chat.service';

const initialState: ChatState = {
    messages: [],
    session: null,
    isTyping: false,
    isConnected: false,
    isLoading: false,
    error: null,
};

export const startChatSession = createAsyncThunk(
    'chat/start',
    async (issueType: string, { rejectWithValue }) => {
        try {
            const initialMessages = await ChatService.connect(issueType);
            return { issueType, messages: initialMessages };
        } catch (error) {
            return rejectWithValue('Failed to start chat');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/send',
    async ({ text, image }: { text: string; image?: string }, { rejectWithValue }) => {
        try {
            const msg = await ChatService.sendMessage(text, image ? 'image' : 'text', image);
            return msg;
        } catch (error) {
            return rejectWithValue('Failed to send message');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        receiveMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setTypingStatus: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },
        endChat: (state) => {
            state.session = null;
            state.messages = [];
            state.isConnected = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startChatSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(startChatSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isConnected = true;
                state.session = {
                    id: `sess_${Date.now()}`,
                    status: 'active',
                    issueType: action.payload.issueType,
                    agentName: 'Zomato Support',
                };
                state.messages = action.payload.messages;
            })
            .addCase(startChatSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    },
});

export const { receiveMessage, setTypingStatus, endChat } = chatSlice.actions;
export default chatSlice.reducer;
