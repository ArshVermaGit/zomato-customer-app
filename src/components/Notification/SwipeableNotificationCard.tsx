import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@zomato/design-tokens';
import NotificationCard from './NotificationCard';
import { NotificationItem } from '../../types/notification.types';

interface SwipeableNotificationCardProps {
    notification: NotificationItem;
    onPress: (notification: NotificationItem) => void;
    onDelete: (id: string) => void;
}

const SwipeableNotificationCard: React.FC<SwipeableNotificationCardProps> = ({
    notification,
    onPress,
    onDelete
}) => {
    const renderRightActions = (
        progress: RNAnimated.AnimatedInterpolation<number>,
        dragX: RNAnimated.AnimatedInterpolation<number>
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(notification.id)}
            >
                <RNAnimated.View style={{ transform: [{ scale }] }}>
                    <Trash2 size={24} color={colors.secondary.white} />
                    <Text style={styles.deleteText}>Delete</Text>
                </RNAnimated.View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <NotificationCard notification={notification} onPress={onPress} />
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: colors.semantic.error,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteText: {
        ...typography.caption,
        color: colors.secondary.white,
        marginTop: 4,
        fontWeight: '600',
    },
});

export default SwipeableNotificationCard;
