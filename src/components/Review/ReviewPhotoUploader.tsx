/**
 * ReviewPhotoUploader Component
 * Mock implementation of photo uploader
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Camera, X, Plus } from 'lucide-react-native';
import { ReviewPhoto } from '../../types/review.types';
import ReviewService from '../../services/review.service';

interface ReviewPhotoUploaderProps {
    photos: ReviewPhoto[];
    onPhotoAdded: (photo: ReviewPhoto) => void;
    onPhotoRemoved: (photoId: string) => void;
}

const ReviewPhotoUploader: React.FC<ReviewPhotoUploaderProps> = ({
    photos,
    onPhotoAdded,
    onPhotoRemoved
}) => {

    const handleAddPhoto = async () => {
        if (photos.length >= 4) {
            Alert.alert('Limit Reached', 'You can upload up to 4 photos.');
            return;
        }

        // Simulating photo selection since we don't have image-picker
        const mockPhotos = [
            'https://b.zmtcdn.com/data/pictures/chains/1/18412861/f70d5526e06b3e70d8a56b5419085871.jpg',
            'https://b.zmtcdn.com/data/reviews_photos/c5a/6a56c4b22c366881c002f5a04467ec5a_1556023923.jpg',
            'https://b.zmtcdn.com/data/reviews_photos/45e/89d2d0b57e7939335bbbd7055734245e_1594917452.jpg',
            'https://b.zmtcdn.com/data/reviews_photos/9c1/4c6792376288647039088654a1be19c1_1626259021.jpg'
        ];

        const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];

        const newPhoto: ReviewPhoto = {
            id: Date.now().toString(),
            uri: randomPhoto,
        };

        // Simulate upload
        try {
            await ReviewService.uploadPhoto(newPhoto);
            onPhotoAdded(newPhoto);
        } catch (error) {
            Alert.alert('Upload Failed', 'Could not upload photo. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Add Button */}
                <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
                    <View style={styles.iconCircle}>
                        <Camera size={24} color="#E23744" />
                        <View style={styles.plusBadge}>
                            <Plus size={10} color="#fff" strokeWidth={3} />
                        </View>
                    </View>
                    <Text style={styles.addText}>Add Photos</Text>
                </TouchableOpacity>

                {/* Photo List */}
                {photos.map((photo) => (
                    <View key={photo.id} style={styles.photoContainer}>
                        <Image source={{ uri: photo.uri }} style={styles.photo} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => onPhotoRemoved(photo.id)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X size={12} color="#fff" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    addButton: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF0F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#FFCDD2',
        borderStyle: 'dashed',
    },
    plusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#E23744',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    addText: {
        fontSize: 12,
        color: '#E23744',
        fontWeight: '500',
    },
    photoContainer: {
        marginRight: 12,
        position: 'relative',
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#333',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
});

export default ReviewPhotoUploader;
