import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { User, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import type { User as UserType } from '../../types/user.types';

interface ProfileHeaderProps {
    user: UserType | null;
    onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.placeholderAvatar}>
                            <User size={32} color={colors.secondary.gray_400} />
                        </View>
                    )}
                </View>

                {/* User Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                        {user?.name || 'Guest User'}
                    </Text>
                    <Text style={styles.email} numberOfLines={1}>
                        {user?.email || 'Login to view your profile'}
                    </Text>
                    <TouchableOpacity style={styles.activityLink} onPress={() => { }}>
                        <Text style={styles.activityText}>View Activity</Text>
                        <ChevronRight size={12} color={colors.primary.zomato_red} />
                    </TouchableOpacity>
                </View>

                {/* Edit Action (Subtle) */}
                <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
        marginBottom: spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: spacing.md,
        ...shadows.sm,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.secondary.white,
    },
    placeholderAvatar: {
        width: 70,
        height: 70,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary.gray_100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.secondary.white,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: 2,
    },
    email: {
        ...typography.body_small,
        color: colors.secondary.gray_600,
        marginBottom: spacing.xs,
    },
    activityLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityText: {
        ...typography.body_small,
        color: colors.primary.zomato_red,
        fontWeight: '600',
        marginRight: 2,
    },
    editButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: colors.secondary.gray_50,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
    },
    editText: {
        ...typography.button_small,
        fontSize: 12,
        color: colors.secondary.gray_900,
    },
});

export default ProfileHeader;
