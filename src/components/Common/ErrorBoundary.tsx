import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // Here you would log to a crash reporting service like Sentry or Crashlytics
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <AlertCircle color="#E23744" size={64} />
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.message}>
                            We encountered an unexpected error. Please try again.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                        {__DEV__ && this.state.error && (
                            <View style={styles.debugBox}>
                                <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#E23744', // Zomato Red
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    debugBox: {
        marginTop: 32,
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        width: '100%',
    },
    debugText: {
        fontFamily: 'Courier',
        fontSize: 12,
        color: '#333',
    },
});

export default ErrorBoundary;
