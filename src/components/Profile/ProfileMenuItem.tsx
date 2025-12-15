import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, touchTargets } from '@zomato/design-tokens';

interface ProfileMenuItemProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    showBorder?: boolean;
    isDestructive?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    label,
    onPress,
    showBorder = true,
    isDestructive = false,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View style={[styles.content, !showBorder && styles.noBorder]}>
                <Text style={[styles.label, isDestructive && styles.destructiveLabel]}>
                    {label}
                </Text>
                <ChevronRight size={16} color={colors.secondary.gray_400} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        backgroundColor: colors.secondary.white,
        minHeight: touchTargets.listItemMinHeight,
    },
    iconContainer: {
        width: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    label: {
        ...typography.body_large,
        color: colors.secondary.gray_900,
        fontWeight: '500',
    },
    destructiveLabel: {
        color: colors.semantic.error,
    },
});

export default ProfileMenuItem;
