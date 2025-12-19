/**
 * Refer & Earn Screen
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Gift, Share2 } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ReferEarnScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Use my code ${user?.referralCode} to get ₹100 off on your first order on Zomato!`,
            });
        } catch (error) {
            // ignore
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.heroSection}>
                    <Gift size={64} color="#E23744" />
                    <Text style={styles.heroTitle}>Invite friends, get rewards</Text>
                    <Text style={styles.heroSubtitle}>
                        Share your code and get ₹50 for every friend who places their first order.
                    </Text>
                </View>

                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
                    <View style={styles.codeBox}>
                        <Text style={styles.code}>{user?.referralCode || 'ZOMATO2025'}</Text>
                        <TouchableOpacity onPress={handleShare}>
                            <Share2 size={20} color="#E23744" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareText}>Share Code</Text>
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Friends Referred</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>₹0</Text>
                        <Text style={styles.statLabel}>Rewards Earned</Text>
                    </View>
                </View>

                <Text style={styles.termsText}>
                    Terms and conditions apply. Max reward limit ₹500 per month.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    codeContainer: {
        width: '100%',
        marginBottom: 24,
    },
    codeLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    code: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        letterSpacing: 2,
    },
    shareButton: {
        backgroundColor: '#E23744',
        width: '100%',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 40,
    },
    shareText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF8F9',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#FFEBEE',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E23744',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    termsText: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
    },
});

export default ReferEarnScreen;
