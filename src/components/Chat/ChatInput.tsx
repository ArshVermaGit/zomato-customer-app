/**
 * Chat Input Component
 * Text input and attachment button
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send, Image as ImageIcon, Paperclip } from 'lucide-react-native';

interface ChatInputProps {
    onSend: (text: string) => void;
    onAttach: () => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onAttach, disabled }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim());
            setText('');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onAttach} style={styles.iconButton} disabled={disabled}>
                <Paperclip size={22} color="#666" />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={500}
                    editable={!disabled}
                />
            </View>

            <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendButton, (!text.trim() || disabled) && styles.sendButtonDisabled]}
                disabled={!text.trim() || disabled}
            >
                <Send size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    iconButton: {
        padding: 10,
        marginBottom: 2,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginHorizontal: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 40,
        maxHeight: 100,
    },
    input: {
        fontSize: 15,
        color: '#333',
        padding: 0,
    },
    sendButton: {
        backgroundColor: '#E23744',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
});

export default ChatInput;
