/**
 * Review Service
 * Mock service for submitting reviews and uploading photos
 */

import { SubmitReviewRequest, ReviewResponse, ReviewPhoto } from '../types/review.types';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));

class ReviewService {
    /**
     * Submit a product and delivery review
     */
    async submitReview(request: SubmitReviewRequest): Promise<ReviewResponse> {
        console.log('Submitting review:', request);

        // Simulate API network delay
        await delay(1500);

        // Mock successful response
        // Randomly award points to simulate gamification
        const pointsEarned = Math.random() > 0.5 ? 10 : 5;

        return {
            success: true,
            message: 'Review submitted successfully',
            pointsEarned,
        };
    }

    /**
     * Upload a photo (Mock)
     * In a real app, this would upload to S3/Cloudinary and return the URL
     */
    async uploadPhoto(photo: ReviewPhoto): Promise<string> {
        console.log('Uploading photo:', photo.uri);

        // Simulate upload delay
        await delay(1000);

        // Return the local URI as the "uploaded" URL for now
        return photo.uri;
    }

    /**
     * Get available tags based on rating
     * Different tags for positive vs negative ratings
     */
    getTagsForRating(rating: number): string[] {
        if (rating >= 4) {
            return [
                'Great Food',
                'Fast Delivery',
                'Good Packaging',
                'Fresh Food',
                'Value for Money',
                'Healthy',
                'Tasty',
            ];
        } else {
            return [
                'Late Delivery',
                'Stale Food',
                'Spilled',
                'Missing Items',
                'Bad Taste',
                'Portion Size',
            ];
        }
    }

    /**
     * Get label and color for a star rating
     */
    getRatingInfo(rating: number): { label: string; color: string } {
        switch (rating) {
            case 1:
                return { label: 'Terrible', color: '#E23744' }; // Red
            case 2:
                return { label: 'Bad', color: '#FF5722' }; // Deep Orange
            case 3:
                return { label: 'Okay', color: '#FF9800' }; // Orange
            case 4:
                return { label: 'Good', color: '#8BC34A' }; // Light Green
            case 5:
                return { label: 'Excellent', color: '#4CAF50' }; // Green
            default:
                return { label: 'Rate', color: '#E0E0E0' }; // Grey
        }
    }
}

export default new ReviewService();
