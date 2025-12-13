/**
 * Chat Bubble Component
 * Renders individual chat messages
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { ChatMessage } from '../../types/chat.types';

interface ChatBubbleProps {
    message: ChatMessage;
    isPrevSameSender: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isPrevSameSender }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.type === 'system';

    if (isSystem) {
        return (
            <View style={styles.systemMessage}>
                <Text style={styles.systemText}>{message.text}</Text>
            </View>
        );
    }

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.agentContainer,
            isPrevSameSender && styles.sameSender
        ]}>
            {!isUser && !isPrevSameSender && (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>Z</Text>
                </View>
            )}
            {!isUser && isPrevSameSender && <View style={styles.avatarPlaceholder} />}

            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.agentBubble,
                isPrevSameSender && (isUser ? styles.sameSenderUser : styles.sameSenderAgent)
            ]}>
                {message.type === 'image' && message.imageUrl && (
                    <Image source={{ uri: message.imageUrl }} style={styles.image} resizeMode="cover" />
                )}

                {message.text && (
                    <Text style={[styles.text, isUser ? styles.userText : styles.agentText]}>
                        {message.text}
                    </Text>
                )}

                <View style={[styles.meta, isUser ? styles.metaRight : styles.metaLeft]}>
                    <Text style={[styles.time, isUser ? styles.userTime : styles.agentTime]}>
                        {formatTime(message.timestamp)}
                    </Text>
                    {isUser && message.status && (
                        message.status === 'read' ? <CheckCheck size={12} color="#fff" style={{ marginLeft: 4 }} />
                            : <Check size={12} color="#fff" style={{ marginLeft: 4 }} />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 12,
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    agentContainer: {
        justifyContent: 'flex-start',
    },
    sameSender: {
        marginBottom: 2,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E23744',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        alignSelf: 'flex-end',
        marginBottom: 2,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    avatarPlaceholder: {
        width: 28,
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: '#2196F3', // Blue for user
        borderBottomRightRadius: 4,
    },
    agentBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sameSenderUser: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    sameSenderAgent: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
    userText: {
        color: '#fff',
    },
    agentText: {
        color: '#333',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metaRight: {
        justifyContent: 'flex-end',
    },
    metaLeft: {
        justifyContent: 'flex-start',
    },
    time: {
        fontSize: 10,
    },
    userTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    agentTime: {
        color: '#999',
    },
    systemMessage: {
        alignItems: 'center',
        marginVertical: 12,
    },
    systemText: {
        fontSize: 12,
        color: '#999',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    }
});

export default ChatBubble;
