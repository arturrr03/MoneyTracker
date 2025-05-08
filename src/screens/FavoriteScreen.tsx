import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ref, onValue, remove } from "firebase/database";
import { showMessage } from "react-native-flash-message";
import { auth, database } from "../config/Firebase";
import BottomNavBar from '../componets/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MyKost: undefined;
  Favorite: undefined;
  Viewed: undefined;
};

const Favorite = () => {
  const [activeTab, setActiveTab] = useState('Favorite');
  const [activeSubTab, setActiveSubTab] = useState<'favorited' | 'viewed'>('favorited');
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setActiveTab('Favorite');
    fetchFavorites();
  }, []);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName as keyof RootStackParamList); // Navigasi ke layar berdasarkan tabName
  };

  const handleSubTabPress = (tab: 'favorited' | 'viewed') => {
    setActiveSubTab(tab);
    if (tab === 'viewed') {
      navigation.navigate('Viewed'); // Navigasi ke layar "Viewed"
    }
  };

  const fetchFavorites = () => {
    const user = auth.currentUser;
    if (user) {
      const favoritesRef = ref(database, `users/${user.uid}/favorites`);
      onValue(favoritesRef, (snapshot) => {
        if (snapshot.exists()) {
          const favData = snapshot.val();
          const favArray = Object.values(favData);
          setFavorites(favArray);
        }
      });
    }
  };

  const handleDeleteFavorite = async (itemId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      const favoriteRef = ref(database, `users/${user.uid}/favorites/${itemId}`);
      await remove(favoriteRef);
  
      showMessage({
        message: "Success",
        description: "Item removed from favorites",
        type: "success"
      });
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Failed to remove item",
        type: "danger"
      });
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteCard}>
      <Image source={{ uri: item.image }} style={styles.kostImage} />
      <View style={styles.kostInfo}>
        <View style={styles.kostHeader}>
          <Text style={styles.kostName}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => handleDeleteFavorite(item.id)}
            style={styles.deleteButton}
          >
            <Image 
              source={require('../../assets/trash.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.kostLocation}>{item.location}</Text>
        <Text style={styles.kostPrice}>Rp {item.price} / month</Text>
      </View>
    </View>
  );

  const FONTS = {
    REGULAR: 'Geist-Regular',
    MEDIUM: 'Geist-Medium',
    BOLD: 'Geist-Bold',
    SEMIBOLD: 'Geist-SemiBold',
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <Text style={[styles.header, { fontFamily: FONTS.BOLD, color: '#000' }]}>Favorit</Text>

        {/* Subtab */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => handleSubTabPress('favorited')} style={styles.tabButton}>
            <Text
              style={[
                styles.tabText,
                activeSubTab === 'favorited' && styles.activeTabText,
                { fontFamily: FONTS.MEDIUM },
              ]}
            >
              Difavoritkan
            </Text>
            {activeSubTab === 'favorited' && <View style={styles.activeLine} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSubTabPress('viewed')} style={styles.tabButton}>
            <Text
              style={[
                styles.tabText,
                activeSubTab === 'viewed' && styles.activeTabText,
                { fontFamily: FONTS.MEDIUM },
              ]}
            >
              Pernah Dilihat
            </Text>
            {activeSubTab === 'viewed' && <View style={styles.activeLine} />}
          </TouchableOpacity>
        </View>

        {/* Konten list favorit */}
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="Favorite" onTabPress={handleTabPress} />
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#5CB85C', // Changed to green
    fontWeight: 'bold',
  },
  activeLine: {
    marginTop: 4,
    height: 2,
    backgroundColor: '#5CB85C', // Changed to green
    width: '100%',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  kostImage: {
    width: '100%',
    height: 150,
  },
  kostInfo: {
    padding: 16,
  },
  kostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kostName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kostLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  kostPrice: {
    fontSize: 14,
    color: '#5CB85C',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});