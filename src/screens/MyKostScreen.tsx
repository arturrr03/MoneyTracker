import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import BottomNavBar from '../componets/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MyKost: undefined;
  Favorite: undefined;
  Profile: undefined;
  Setting: undefined;
  EditProfile: undefined; 
};

const MyKost = () => {
  const [activeTab, setActiveTab] = useState('MyKost');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName as keyof RootStackParamList); // Navigasi ke layar berdasarkan tabName
  };

  const FONTS = {
    REGULAR: 'Geist-Regular',
    MEDIUM: 'Geist-Medium',
    BOLD: 'Geist-Bold',
    SEMIBOLD: 'Geist-SemiBold',
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <Text style={[styles.header, { fontFamily: FONTS.BOLD }]}>Kos Saya</Text>

        {/* Info Box */}
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { fontFamily: FONTS.SEMIBOLD }]}>Kamu belum menyewa kos</Text>
          <Text style={[styles.description, { fontFamily: FONTS.REGULAR }]}>
            Yuk sewa di CozyKost atau masukkan kode dari pemilik kost untuk aktifkan halaman ini! Coba cara ngekost modern dengan manfaat berikut ini.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={[styles.primaryButtonText, { fontFamily: FONTS.MEDIUM }]}>
              Mulai cari dan sewa kost
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={[styles.secondaryButtonText, { fontFamily: FONTS.MEDIUM }]}>
              Masukkan kode dari pemilik
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default MyKost;

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
  infoContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555555',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 193,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#4CAF50',
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});
