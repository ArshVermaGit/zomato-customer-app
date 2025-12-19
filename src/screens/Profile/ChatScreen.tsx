/**
 * Chat Support Screen
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Phone } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { startChatSession, sendMessage, setTypingStatus, receiveMessage, endChat } from '../../store/slices/chatSlice';
import { ChatService } from '../../services/chat.service';
import ChatBubble from '../../components/Chat/ChatBubble';
import ChatInput from '../../components/Chat/ChatInput';

const ISSUE_TYPES = [
    { id: '1', title: 'Order Issue', icon: '🛍️' },
    { id: '2', title: 'Payment', icon: '💳' },
    { id: '3', title: 'Account', icon: '👤' },
    { id: '4', title: 'Other', icon: '❓' },
];

const ChatScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const scrollViewRef = useRef<FlatList>(null);
    const { messages, session, isTyping } = useSelector((state: RootState) => state.chat);

    // Local state for initial view
    const [hasSelectedIssue, setHasSelectedIssue] = useState(false);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            dispatch(endChat());
        };
    }, []);

    useEffect(() => {
        if (session) {
            // Subscribe to service events
            const unsubMsg = ChatService.onMessage((msg) => {
                dispatch(receiveMessage(msg));
            });
            const unsubTyping = ChatService.onTyping((typing) => {
                dispatch(setTypingStatus(typing));
            });

            return () => {
                unsubMsg();
                unsubTyping();
            };
        }
        return () => { };
    }, [session, dispatch]);

    const handleIssueSelect = async (issue: string) => {
        setHasSelectedIssue(true);
        await dispatch(startChatSession(issue));
    };

    const handleSend = (text: string) => {
        dispatch(sendMessage({ text }));
    };

    const handleAttach = () => {
        // Simulate image attach
        dispatch(sendMessage({
            text: 'Image attached',
            image: 'https://via.placeholder.com/300'
        }));
    };

    const renderIssueSelection = () => (
        <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>How can we help you?</Text>
            <View style={styles.grid}>
                {ISSUE_TYPES.map(issue => (
                    <TouchableOpacity
                        key={issue.id}
                        style={styles.issueCard}
                        onPress={() => handleIssueSelect(issue.title)}
                    >
                        <Text style={styles.issueIcon}>{issue.icon}</Text>
                        <Text style={styles.issueText}>{issue.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderChat = () => (
        <>
            <FlatList
                ref={scrollViewRef}
                data={messages}
                renderItem={({ item, index }) => (
                    <ChatBubble
                        message={item}
                        isPrevSameSender={index > 0 && messages[index - 1].sender === item.sender}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingContainer}>
                            <Text style={styles.typingText}>Support is typing...</Text>
                        </View>
                    ) : null
                }
            />
            <ChatInput onSend={handleSend} onAttach={handleAttach} />
        </>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Support Chat</Text>
                    {session && <Text style={styles.headerSubtitle}>● Active Now</Text>}
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Phone size={20} color="#333" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                {!hasSelectedIssue ? renderIssueSelection() : renderChat()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    menuButton: {
        padding: 8,
    },
    keyboardView: {
        flex: 1,
    },
    selectionContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 32,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },
    issueCard: {
        width: '45%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    issueIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    issueText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    typingContainer: {
        paddingLeft: 12,
        marginBottom: 12,
    },
    typingText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default ChatScreen;
