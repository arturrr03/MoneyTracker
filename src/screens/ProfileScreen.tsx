import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons';
import BottomNavBar from '../componets/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, get, set, onValue, update } from "firebase/database";
import { auth, database } from "../config/Firebase";
import { showMessage } from "react-native-flash-message";
import { launchImageLibrary } from 'react-native-image-picker';


type RootStackParamList = {
  Home: undefined;
  MyKost: undefined;
  Favorite: undefined;
  Profile: undefined;
  Setting: undefined;
  EditProfile: undefined; // Tambahkan layar Edit Profile
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [userData, setUserData] = useState({
    name: 'User',
    phone: '08123456789',
    profileImage: null,
    email: '',
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Update userData with the values from database
          setUserData({
            name: data.name || 'User',
            phone: data.phone || '08123456789',
            profileImage: data.profileImage || null,
            email: data.email || user.email || '',
          });
        } else {
          // If user data doesn't exist in database, use auth data
          setUserData({
            name: user.displayName || 'User',
            phone: user.phoneNumber || '08123456789',
            profileImage: user.photoURL || null,
            email: user.email || '',
          });
        }

        // Listen for real-time updates
        const unsubscribe = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(prevData => ({
              ...prevData,
              name: data.name || prevData.name,
              phone: data.phone || prevData.phone,
              profileImage: data.profileImage || prevData.profileImage,
              email: data.email || prevData.email,
            }));
          }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to load user data',
        type: 'danger',
      });
    }
  };

  // Add this effect to update user data when auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        // Reset user data if logged out
        setUserData({
          name: 'User',
          phone: '08123456789',
          profileImage: null,
          email: '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName as keyof RootStackParamList); // Navigasi ke layar berdasarkan tabName
  };

  const handleSettingPress = () => {
    navigation.navigate('Setting'); // Navigasi ke layar Setting
  };

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile'); // Navigasi ke layar Edit Profile
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) {
        return;
      }
  
      if (result.errorCode) {
        showMessage({
          message: 'Error',
          description: result.errorMessage,
          type: 'danger',
        });
        return;
      }
  
      if (result.assets && result.assets[0].uri) {
        try {
          const user = auth.currentUser;
          if (!user) return;
  
          // Get the local URI of the selected image
          const imageUri = result.assets[0].uri;
  
          // Update user profile in database with the local URI
          const userRef = ref(database, `users/${user.uid}`);
          await update(userRef, {
            ...userData,
            profileImage: imageUri
          });
  
          // Update local state
          setUserData(prev => ({
            ...prev,
            profileImage: imageUri
          }));
  
          showMessage({
            message: 'Success',
            description: 'Profile image updated successfully',
            type: 'success',
          });
        } catch (error) {
          showMessage({
            message: 'Error',
            description: error.message,
            type: 'danger',
          });
        }
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: error.message,
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleImagePicker}>
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profilePictureLarge}
              />
            ) : (
              <View style={styles.profilePictureLarge}>
                {/* <MaterialCommunityIcons name="camera" size={32} color="#757575" /> */}
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userNameLarge}>{userData.name}</Text>
          <Text style={styles.userPhoneLarge}>{userData.phone}</Text>
          <TouchableOpacity onPress={handleEditProfilePress}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu List */}
      <ScrollView style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="file-document-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Riwayat Pengajuan Sewa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="home-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Riwayat kos terdahulu</Text>
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>Baru</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="receipt-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Riwayat transaksi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="star-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>CozyKost Poin</Text>
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>Baru</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="ticket-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Voucher saya</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="briefcase-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Barang & jasa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          {/* <MaterialCommunityIcons name="account-check-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Verifikasi akun</Text>
          <Text style={styles.notVerifiedText}>Not Verified</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
          {/* <MaterialCommunityIcons name="cog-outline" size={24} color="#212121" /> */}
          <Text style={styles.menuText}>Pengaturan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3F51B5',
    paddingBottom: 32,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 16,
  },
  profilePictureLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userNameLarge: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhoneLarge: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notVerifiedText: {
    color: '#757575',
    fontSize: 12,
  },
});

export default Profile;