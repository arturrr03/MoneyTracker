import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import BottomNavBar from '../componets/BottomNavBar';
import { ref, set, get, onValue, remove } from "firebase/database";
import { auth, database } from "../config/Firebase";
import { showMessage } from "react-native-flash-message";

const FONTS = {
  REGULAR: 'Geist-Regular',
  MEDIUM: 'Geist-Medium',
  BOLD: 'Geist-Bold',
  SEMIBOLD: 'Geist-SemiBold',
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [userData, setUserData] = useState({
    name: '',
    phone: ''
  });
  const [kosts, setKosts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchUserData();
    fetchKosts();
    fetchFavorites();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Update userData with name from signup
          setUserData({
            name: data.name || 'User',
            phone: data.phone || ''
          });

          // Set up real-time listener for user data changes
          const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const updatedData = snapshot.val();
              setUserData({
                name: updatedData.name || 'User',
                phone: updatedData.phone || ''
              });
            }
          });

          // Cleanup listener on unmount
          return () => unsubscribe();
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchKosts = async () => {
    const kostsRef = ref(database, 'kosts');
    const snapshot = await get(kostsRef);
    if (snapshot.exists()) {
      const kostsData = [];
      snapshot.forEach((childSnapshot) => {
        kostsData.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setKosts(kostsData);
    }
  };

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (user) {
      const favoritesRef = ref(database, `users/${user.uid}/favorites`);
      onValue(favoritesRef, (snapshot) => {
        if (snapshot.exists()) {
          setFavorites(snapshot.val());
        } else {
          setFavorites({});
        }
      });
    }
  };

  const handleSaveKost = async (kostId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const savedRef = ref(database, `users/${user.uid}/saved/${kostId}`);
        await set(savedRef, true);
        showMessage({
          message: "Success",
          description: "Kost saved successfully!",
          type: "success"
        });
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger"
      });
    }
  };

  const toggleFavorite = async (kost) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showMessage({
          message: "Error",
          description: "Please login first",
          type: "warning"
        });
        return;
      }

      const favoriteRef = ref(database, `users/${user.uid}/favorites/${kost.id}`);
      
      if (favorites[kost.id]) {
        // Remove from favorites
        await remove(favoriteRef);
        showMessage({
          message: "Success",
          description: "Removed from favorites",
          type: "success"
        });
      } else {
        // Add to favorites
        await set(favoriteRef, {
          id: kost.id,
          name: kost.name,
          location: kost.location,
          price: kost.price,
          image: kost.image,
          timestamp: Date.now()
        });
        showMessage({
          message: "Success",
          description: "Added to favorites",
          type: "success"
        });
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger"
      });
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName as keyof RootStackParamList);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/cozykost.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>COZYKOST</Text>
        </View>
        <TouchableOpacity>
          {/* <Ionicons name="notifications-outline" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBarContainer}>
          {/* <Ionicons */}
            {/* name="search-outline"
            size={16}
            color="#999"
            style={styles.searchIcon}
          /> */}
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kost"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.greetingContainer}>
          <Text style={[styles.greetingText, { fontFamily: FONTS.BOLD }]}>
            Hai, {userData.name}!
          </Text>
          <Text style={[styles.subGreetingText, { fontFamily: FONTS.REGULAR }]}>
            Lagi mau ngekost?
          </Text>
        </View>

       

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: 'https://1.bp.blogspot.com/-FGtRm9oHyWs/WLfM47weamI/AAAAAAAAAYI/eb6CpoH7aOgB-pe8YKjfMusCA3NWgyhMgCLcB/s1600/desain%2Bkos%2Bkosan%2B10%2Bkamar.jpg',
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Kost di Manado</Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/7Ml2gPDKrRcq8ZlmGIZnh_RE-2BX-_OtLC6ts97xiP8j6n2uvTt4-DDUMeBUmpQL_yfdQ1tSHE7xXkSnlE82uWHs6Gm7DnBALeEx0ZZWo4fzPRJ2P5b0sCxuEijHuorEfiqQWKjBUV-ItnxtjS3vYfN9aMOzjrdoLpup7KHFwLspTsaIykshRwuu5ZrfzvPOZvQve6_fug',
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Kost di Tomohon</Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.scanButtonContainer}>
          <Text style={styles.scanButtonText}>
            Scan QR dan langsung bayar di tempat
          </Text>
          <View style={styles.scanIconContainer}>
            {/* <Ionicons name="qr-code" size={16} color="#666" /> */}
            {/* <Ionicons */}
              {/* name="expand"
              size={14}
              color="#666"
              style={styles.expandIcon}
            /> */}
          </View>
        </TouchableOpacity>

        <View style={styles.cityFilterContainer}>
          <TouchableOpacity style={styles.cityFilterButton}>
            <Text style={styles.cityFilterButtonText}>Semua Kota</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cityFilterButton, styles.cityFilterButtonMiddle]}>
            <Text style={styles.cityFilterButtonText}>Manado</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cityFilterButton}>
            <Text style={styles.cityFilterButtonText}>Airmadidi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Near you</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}>
            <TouchableOpacity style={styles.nearPropertyCard}>
              <View style={styles.categoryBadge}>
                <Image 
                  source={require('../../assets/home.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryBadgeText}>Kamar kos</Text>
              </View>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite({
                  id: 'kost-1', // Add unique ID for each kost
                  name: 'Kost Harmony',
                  location: 'Malalayang, Manado',
                  price: '1.500.000',
                  image: 'https://teknologiraya.com/wp-content/uploads/2024/03/memilih-kos-kosan.webp'
                })}>
                <Image 
                  source={favorites['kost-1'] 
                    ? require('../../assets/love.png')
                    : require('../../assets/love.png')
                  }
                  style={styles.favoriteIcon}
                />
              </TouchableOpacity>
              <Image
                source={{
                  uri: 'https://teknologiraya.com/wp-content/uploads/2024/03/memilih-kos-kosan.webp',
                }}
                style={styles.nearPropertyImage}
              />
              <Text style={styles.nearPropertyName}>Kost Harmony</Text>
              <View style={styles.locationRow}>
                {/* <Ionicons name="location-outline" size={12} color="#666" /> */}
                <Text style={styles.locationText}>Malalayang, Manado</Text>
              </View>
              <View style={styles.ratingBadge}>
                {/* <Ionicons name="star" size={12} color="#FFD700" /> */}
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nearPropertyCard}>
              <View style={styles.categoryBadge}>
                <Image 
                  source={require('../../assets/home.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryBadgeText}>Penginapan harian</Text>
              </View>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite({
                  id: 'penginapan-1',
                  name: 'Villa Sunset',
                  location: 'Tomohon, Sulawesi Utara',
                  price: '350.000',
                  image: 'https://storage.googleapis.com/storage-ajaib-prd-platform-wp-artifact/2020/10/Kos-kosan.jpg'
                })}>
                <Image 
                  source={favorites['penginapan-1'] 
                    ? require('../../assets/love.png')
                    : require('../../assets/love.png')
                  }
                  style={styles.favoriteIcon}
                />
              </TouchableOpacity>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/storage-ajaib-prd-platform-wp-artifact/2020/10/Kos-kosan.jpg',
                }}
                style={styles.nearPropertyImage}
              />
              <Text style={styles.nearPropertyName}>Villa Sunset</Text>
              <View style={styles.locationRow}>
                <Image 
                  source={require('../../assets/location.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>Tomohon, Sulawesi Utara</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Image 
                  source={require('../../assets/star.png')}
                  style={styles.starIcon}
                />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nearPropertyCard}>
              <View style={styles.categoryBadge}>
                <Image 
                  source={require('../../assets/home.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryBadgeText}>Penginapan harian</Text>
              </View>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite({
                  id: 'penginapan-2',
                  name: 'Embun House',
                  location: 'Airmadidi, Minahasa Utara',
                  price: '300.000',
                  image: 'https://storage.googleapis.com/storage-ajaib-prd-platform-wp-artifact/2020/10/Kos-kosan.jpg'
                })}>
                <Image 
                  source={favorites['penginapan-2'] 
                    ? require('../../assets/love.png')
                    : require('../../assets/love.png')
                  }
                  style={styles.favoriteIcon}
                />
              </TouchableOpacity>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/storage-ajaib-prd-platform-wp-artifact/2020/10/Kos-kosan.jpg',
                }}
                style={styles.nearPropertyImage}
              />
              <Text style={styles.nearPropertyName}>Embun House</Text>
              <View style={styles.locationRow}>
                <Image 
                  source={require('../../assets/location.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>Airmadidi, Minahasa Utara</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Image 
                  source={require('../../assets/star.png')}
                  style={styles.starIcon}
                />
                <Text style={styles.ratingText}>4.3</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.recommendedCard}>
            <Image
              source={{
                uri: 'https://www.desain.id/blog/storage/uploads/contents/371/desain-rumah-kos-kosan-2-lantai-terbaik.png',
              }}
              style={styles.recommendedImage}
            />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedName}>Kost Ocean</Text>
              <Text style={styles.locationText}>
                Jl. Jenderal Sudirman, Tondano
              </Text>
              <View style={styles.facilityContainer}>
                <View style={styles.facilityItem}>
                  {/* <Ionicons */}
                    {/* name="bed-outline"
                    size={12}
                    color="#666"
                    style={styles.facilityIcon}
                  /> */}
                  <Text style={styles.facilityText}>5 Bedroom</Text>
                </View>
                <View style={styles.facilityItem}>
                  {/* <Ionicons */}
                    {/* name="bath-outline"
                    size={12}
                    color="#666"
                    style={styles.facilityIcon}
                  /> */}
                  <Text style={styles.facilityText}>2 Bathroom</Text>
                </View>
              </View>
              <Text style={styles.recommendedPrice}>Rp. 1.500.000 / month</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendedCard}>
            <Image
              source={{
                uri: 'https://lh5.googleusercontent.com/f_81YT1qjBOWkk-zJKfXnt6xKgLDbFymZk3Avkx_jXClnEnsLM7_mxtoSMwFBqO_nZUSK76gGeoAjwoUurUxaUuUV5Q0ka-8Q_CtYbfjsFQHWFfKq_SG6Ppl6_l5a83yCzPE0noOde8IUl1AHPBIwxVFGKENx_ntjxR9_GclqelDM01qd19QBc0xPom_XRV6i0yXCVcwjg',
              }}
              style={styles.recommendedImage}
            />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedName}>Opera Kost</Text>
              <Text style={styles.locationText}>Paal Dua, Manado</Text>
              <View style={styles.facilityContainer}>
                <View style={styles.facilityItem}>
                  {/* <Ionicons */}
                    {/* name="bed-outline"
                    size={12}
                    color="#666"
                    style={styles.facilityIcon}
                  /> */}
                  <Text style={styles.facilityText}>6 Bedroom</Text>
                </View>
                <View style={styles.facilityItem}>
                  {/* <Ionicons */}
                    {/* name="bath-outline"
                    size={12}
                    color="#666"
                    style={styles.facilityIcon}
                  /> */}
                  <Text style={styles.facilityText}>2 Bathroom</Text>
                </View>
              </View>
              <Text style={styles.recommendedPrice}>Rp. 1.800.000 / month</Text>
            </View>
          </TouchableOpacity>

          <View style={{height: 80}} />
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: 24,
    padding: 0,
    fontFamily: FONTS.REGULAR,
  },
  greetingContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
  subGreetingText: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryCard: {
    alignItems: 'center',
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: FONTS.MEDIUM,
    textAlign: 'center',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 150,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: FONTS.BOLD,
    textShadowColor: '#000',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
    color: 'white',
    marginBottom: 8,
  },
  exploreButton: {
    backgroundColor: '#5CB85C',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONTS.BOLD,
  },
  scanButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  scanButtonText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    color: '#333',
  },
  scanIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginLeft: 8,
  },
  cityFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  cityFilterButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cityFilterButtonMiddle: {
    marginHorizontal: 10,
  },
  cityFilterButtonText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    color: '#333',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.BOLD,
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    color: '#5CB85C',
  },
  horizontalScroll: {
    paddingBottom: 12,
    marginLeft: -8,
  },
  horizontalScrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  nearPropertyCard: {
    marginTop: 16,
    marginRight: 16,
    backgroundColor: '#F2F8F2',
    borderRadius: 16,
    width: 220,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  nearPropertyImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  nearPropertyName: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    color: '#333',
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: '#666',
    marginLeft: 4,
    flexShrink: 1,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.BOLD,
    color: '#333',
    marginLeft: 2,
  },
  facilityContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  facilityIcon: {
    marginRight: 4,
  },
  facilityText: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: '#666',
  },
  recommendedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recommendedDetails: {
    padding: 16,
  },
  recommendedName: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    marginBottom: 6,
    color: '#333',
  },
  recommendedPrice: {
    fontSize: 14,
    fontFamily: FONTS.SEMIBOLD,
    color: '#5CB85C',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.REGULAR,
    color: '#333',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default HomeScreen;
