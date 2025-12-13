import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {/* Top Row: Location & Profile */}
            <View style={styles.topRow}>
                <View style={styles.locationContainer}>
                    <MapPin color="#E23744" size={24} />
                    <View style={styles.addressContainer}>
                        <Text style={styles.locationTitle}>Home</Text>
                        <Text style={styles.address} numberOfLines={1}>
                            123, Cyber City, Gurugram...
                        </Text>
                    </View>
                </View>

                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell color="#333" size={24} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <User color="#333" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
                style={styles.searchBar}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.9}
            >
                <Search color="#E23744" size={20} style={{ marginRight: 10 }} />
                <Text style={styles.searchText}>Restaurant name, cuisine, or a dish...</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addressContainer: {
        marginLeft: 10,
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E23744',
    },
    address: {
        fontSize: 12,
        color: '#666',
        maxWidth: 200,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E23744',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchText: {
        color: '#999',
    },
});

export default HomeHeader;
