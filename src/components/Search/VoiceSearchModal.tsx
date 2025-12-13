import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Mic, X } from 'lucide-react-native';
import Voice from '@react-native-voice/voice';

interface VoiceSearchModalProps {
    visible: boolean;
    onClose: () => void;
    onResult: (text: string) => void;
}

const VoiceSearchModal = ({ visible, onClose, onResult }: VoiceSearchModalProps) => {
    const [isListening, setIsListening] = useState(false);
    const [partialResult, setPartialResult] = useState('');

    useEffect(() => {
        if (visible) {
            startListening();
        } else {
            stopListening();
        }

        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechError = (e) => console.log('Speech Error:', e);

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [visible]);

    const startListening = async () => {
        try {
            await Voice.start('en-US');
            setIsListening(true);
            setPartialResult('');
        } catch (e) {
            console.error(e);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (e) {
            console.error(e);
        }
    };

    const onSpeechResults = (e: any) => {
        if (e.value && e.value.length > 0) {
            onResult(e.value[0]);
            onClose();
        }
    };

    const onSpeechPartialResults = (e: any) => {
        if (e.value && e.value.length > 0) {
            setPartialResult(e.value[0]);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.container}>
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={onClose}>
                        <X color="#fff" size={30} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.listeningText}>
                        {isListening ? 'Listening...' : 'Processing...'}
                    </Text>
                    <Text style={styles.resultText}>{partialResult}</Text>

                    <View style={[styles.micCircle, isListening && styles.micActive]}>
                        <Mic color="#fff" size={40} />
                    </View>

                    <Text style={styles.hintText}>Try saying "Biryani" or "KFC"</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    listeningText: {
        color: '#ccc',
        fontSize: 18,
        marginBottom: 20,
    },
    resultText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
        minHeight: 60,
    },
    micCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E23744',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        elevation: 5,
    },
    micActive: {
        transform: [{ scale: 1.1 }], // Simple placeholder for pulse
    },
    hintText: {
        color: '#999',
        fontSize: 14,
    },
});

export default VoiceSearchModal;
