import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import BottomNavBar from'../componets/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, get } from "firebase/database";
import { auth, database } from "../config/Firebase";


type RootStackParamList = {
  Home: undefined;
  MyKost: undefined;
  Favorite: undefined;
  Profile: undefined;
  Setting: undefined;
  EditProfile: undefined; 
  Viewed: undefined; // Tambahkan layar Viewed
};

const Viewed = () => {
  const [activeTab, setActiveTab] = useState('Favorite');
  const [activeSubTab, setActiveSubTab] = useState<'favorited' | 'viewed'>('viewed');
  const [savedKosts, setSavedKosts] = useState([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchSavedKosts();
  }, []);

  const fetchSavedKosts = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const savedRef = ref(database, `users/${user.uid}/saved`);
        const snapshot = await get(savedRef);
        
        if (snapshot.exists()) {
          const savedIds = Object.keys(snapshot.val());
          const kostsData = [];
          
          for (const kostId of savedIds) {
            const kostRef = ref(database, `kosts/${kostId}`);
            const kostSnapshot = await get(kostRef);
            if (kostSnapshot.exists()) {
              kostsData.push({
                id: kostId,
                ...kostSnapshot.val()
              });
            }
          }
          
          setSavedKosts(kostsData);
        }
      }
    } catch (error) {
      console.error('Error fetching saved kosts:', error);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName as keyof RootStackParamList);
  };

  const handleSubTabPress = (tab: 'favorited' | 'viewed') => {
    setActiveSubTab(tab);
    if (tab === 'favorited') {
      navigation.navigate('Favorite'); // ✅ Navigasi balik ke Favorite
    }
  };

  const FONTS = {
    REGULAR: 'Geist-Regular',
    MEDIUM: 'Geist-Medium',
    BOLD: 'Geist-Bold',
    SEMIBOLD: 'Geist-SemiBold',
  };

  const renderKostItem = ({ item }) => (
    <TouchableOpacity style={styles.kostCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.kostImage}
        defaultSource={require('../../assets/empty-history.png')}
      />
      <View style={styles.kostInfo}>
        <Text style={[styles.kostName, { fontFamily: FONTS.SEMIBOLD }]}>
          {item.name}
        </Text>
        <Text style={[styles.kostLocation, { fontFamily: FONTS.REGULAR }]}>
          {item.location}
        </Text>
        <Text style={[styles.kostPrice, { fontFamily: FONTS.MEDIUM }]}>
          Rp {item.price?.toLocaleString('id-ID')} / bulan
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/empty-history.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[styles.emptyTitle, { fontFamily: FONTS.SEMIBOLD }]}>
        Belum ada kost yang disimpan
      </Text>
      <Text style={[styles.emptyDesc, { fontFamily: FONTS.REGULAR }]}>
        Kost yang Anda simpan akan muncul di sini
      </Text>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.searchButtonText, { fontFamily: FONTS.MEDIUM }]}>
          Cari Kost
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <Text style={[styles.header, { fontFamily: FONTS.BOLD }]}>Favorit</Text>

        {/* Subtabs */}
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

          <TouchableOpacity onPress={() => handleSubTabPress('Viewed')} style={styles.tabButton}>
            <Text
              style={[
                styles.tabText,
                activeSubTab === 'Viewed' && styles.activeTabText,
                { fontFamily: FONTS.MEDIUM },
              ]}
            >
              Pernah Dilihat
            </Text>
            {activeSubTab === 'Viewed' && <View style={styles.activeLine} />}
          </TouchableOpacity>
        </View>

        {savedKosts.length > 0 ? (
          <FlatList
            data={savedKosts}
            renderItem={renderKostItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.kostList}
          />
        ) : (
          <EmptyState />
        )}
      </SafeAreaView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Viewed;

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
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  activeLine: {
    height: 2,
    backgroundColor: '#4CAF50',
    marginTop: 4,
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  kostList: {
    padding: 16,
  },
  kostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  kostImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  kostInfo: {
    padding: 16,
  },
  kostName: {
    fontSize: 16,
    marginBottom: 4,
  },
  kostLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  kostPrice: {
    fontSize: 16,
    color: '#4CAF50',
  },
});