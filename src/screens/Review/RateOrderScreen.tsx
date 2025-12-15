/**
 * RateOrderScreen
 * Main screen for submitting order reviews
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import LottieView from 'lottie-react-native';

import {
    StarRating,
    QuickTags,
    ReviewPhotoUploader,
    DeliveryPartnerRating,
} from '../../components/Review';

import ReviewService from '../../services/review.service';
import type { OrderStackParamList } from '../../types/order.types';
import type { ReviewPhoto, SubmitReviewRequest, ReviewTag } from '../../types/review.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<OrderStackParamList & RootStackParamList, 'RateOrder'>;
type RouteProps = RouteProp<OrderStackParamList, 'RateOrder'>;

const RateOrderScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { orderId } = route.params;

    // Get order details from Redux
    // In a real app, we might need to fetch this if not in state, but for now we assume it's the active order or in history
    // Since we don't have a reliable 'getOrderById' selector yet for history, we'll use activeOrder if it matches, or mock data for demo
    const activeOrder = useSelector((state: RootState) => state.order.activeOrder);
    const order = activeOrder?.id === orderId ? activeOrder : activeOrder; // Fallback to activeOrder for demo purposes if ID doesn't match

    const [rating, setRating] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState<ReviewPhoto[]>([]);

    const [partnerRating, setPartnerRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);

    // Get available tags based on current rating
    const availableTags = ReviewService.getTagsForRating(rating);

    useEffect(() => {
        // Reset tags when rating changes significantly (positive <-> negative)
        setTags([]);
    }, [rating < 4]);

    const handleToggleTag = (tag: string) => {
        // We handle tags as strings in the UI component but cast when submitting
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please rate your order to continue.');
            return;
        }

        setIsSubmitting(true);

        const request: SubmitReviewRequest = {
            orderId,
            restaurantId: order?.restaurant.id || 'unknown',
            rating,
            tags: tags as ReviewTag[],
            comment,
            photos,
            deliveryPartnerRating: order?.deliveryPartner ? {
                partnerId: order.deliveryPartner.id,
                rating: partnerRating,
            } : undefined,
        };

        try {
            const response = await ReviewService.submitReview(request);
            if (response.success) {
                setPointsEarned(response.pointsEarned || 0);
                // Navigate to Success Screen
                navigation.navigate('ReviewSuccess', { pointsEarned: response.pointsEarned || 0 });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        navigation.goBack();
    };



    if (!order) {
        // Fallback if order not found (shouldn't happen in this flow)
        return (
            <SafeAreaView style={styles.container}>
                <Text>Order not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rate Order</Text>
                <TouchableOpacity onPress={handleSkip} style={styles.closeButton}>
                    <X size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Restaurant Info */}
                    <View style={styles.restaurantSection}>
                        <Image source={{ uri: order.restaurant.image }} style={styles.restaurantImage} />
                        <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                        <Text style={styles.locationText}>{order.restaurant.address}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Main Rating */}
                    <Text style={styles.questionText}>How was your food?</Text>
                    <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        size={48}
                    />

                    {/* Quick Tags (Only show if rated) */}
                    {rating > 0 && (
                        <QuickTags
                            tags={availableTags}
                            selectedTags={tags}
                            onToggleTag={handleToggleTag}
                        />
                    )}

                    {/* Comment Area */}
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Tell us more (optional)..."
                        multiline
                        numberOfLines={3}
                        value={comment}
                        onChangeText={setComment}
                        maxLength={500}
                    />

                    {/* Photo Upload */}
                    <ReviewPhotoUploader
                        photos={photos}
                        onPhotoAdded={(photo) => setPhotos([...photos, photo])}
                        onPhotoRemoved={(id) => setPhotos(photos.filter(p => p.id !== id))}
                    />

                    {/* Delivery Partner Rating */}
                    {order.deliveryPartner && (
                        <DeliveryPartnerRating
                            partner={order.deliveryPartner}
                            rating={partnerRating}
                            onRatingChange={setPartnerRating}
                        />
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        rating === 0 && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Review</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
    },
    successAnimation: {
        width: 150,
        height: 150,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginTop: 24,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    pointsContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFF3E0',
        borderRadius: 20,
    },
    pointsText: {
        color: '#EF6C00',
        fontWeight: '600',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    scrollContent: {
        padding: 20,
    },
    restaurantSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    restaurantName: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: 4,
        textAlign: 'center',
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 20,
        width: '100%',
    },
    questionText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    commentInput: {
        backgroundColor: '#F5F6F8',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#333',
        minHeight: 100,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: colors.secondary.white,
    },
    submitButton: {
        backgroundColor: colors.primary.zomato_red,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: colors.secondary.gray_300,
    },
    submitButtonText: {
        color: colors.secondary.white,
        ...typography.button_large,
    },
});

export default RateOrderScreen;
