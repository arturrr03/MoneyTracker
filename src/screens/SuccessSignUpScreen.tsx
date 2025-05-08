import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons';

const FONTS = {
  REGULAR: 'Geist-Regular',
  MEDIUM: 'Geist-Medium',
  BOLD: 'Geist-Bold',
  SEMIBOLD: 'Geist-SemiBold',
};

const SuccessSignUpScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          {/* <FontAwesome6 name="xmark" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Pendaftaran Akun Berhasil</Text>

      <View style={styles.successIconContainer}>
        <View style={styles.successIcon}>
          {/* <FontAwesome6 name="check" size={70} color="#FFFFFF" /> */}
        </View>
      </View>

      <Text style={styles.message}>
        Selamat, kamu berhasil membuat akun pencari kos. Yuk, mulai cari kos
        sekarang!
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.searchButtonText}>Cari Kos</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    marginBottom: 30,
    color: '#000000',
    textAlign: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B4D869',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
    color: '#333333',
  },
  searchButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
});

export default SuccessSignUpScreen;
