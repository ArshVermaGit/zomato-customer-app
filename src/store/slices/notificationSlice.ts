/**
 * Notification Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, NotificationItem } from '../../types/notification.types';
import { NotificationService } from '../../services/notification.service';

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    pushToken: null,
    permissionStatus: null,
};

export const fetchNotifications = createAsyncThunk(
    'notification/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const data = await NotificationService.getNotifications();
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    'notification/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await NotificationService.markAsRead(id);
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    'notification/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            const data = await NotificationService.markAllAsRead();
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await NotificationService.deleteNotification(id);
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setPermissionStatus: (state, action: PayloadAction<any>) => {
            state.permissionStatus = action.payload;
        },
        receiveNotification: (state, action: PayloadAction<NotificationItem>) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                state.items = action.payload; // Or update locally for efficiency
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
                state.items = action.payload;
                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            });
    },
});

export const { setPermissionStatus, receiveNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
