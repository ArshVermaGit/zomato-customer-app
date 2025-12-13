import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import DishItem from './DishItem';

const MenuTab = ({ menu, onAddToCart }: { menu: any[], onAddToCart: (item?: any) => void }) => {
    return (
        <View style={styles.container}>
            <SectionList
                sections={menu}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <DishItem dish={item} onAdd={() => onAddToCart(item)} onRemove={() => { }} />
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemContainer: {
        paddingHorizontal: 20,
    },
});

export default MenuTab;
