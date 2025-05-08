import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/Firebase';
import { signOut } from 'firebase/auth';

const Setting = () => {
  const [emailNotification, setEmailNotification] = useState(true);
  const [chatNotification, setChatNotification] = useState(true);
  const navigation = useNavigation(); // Gunakan navigation untuk kembali ke layar sebelumnya

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Apakah anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Ya", 
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> {/* Navigasi kembali */}
          {/* <Icon name="arrow-left" size={24} color="#000" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            {/* <Icon name="bell-outline" size={24} color="#000" /> */}
            <Text style={styles.settingTitle}>Notifikasi</Text>
          </View>
          <View style={styles.settingContent}>
            <View style={styles.notificationRow}>
              <Text style={styles.settingSubtitle}>Rekomendasi via email</Text>
              <Switch
                value={emailNotification}
                onValueChange={setEmailNotification}
              />
            </View>
            <View style={styles.notificationRow}>
              <Text style={styles.settingSubtitle}>Notifikasi via chat</Text>
              <Switch
                value={chatNotification}
                onValueChange={setChatNotification}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          {/* <Icon name="lock-outline" size={24} color="#000" /> */}
          <Text style={styles.settingTitle}>Ubah Password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleLogout}>
          <Image 
            source={require('../../assets/logout.png')}
            style={styles.iconStyle}
          />
          <Text style={[styles.settingTitle, styles.logoutText]}>Logout Akun</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteAccount}>
        {/* <Icon name="trash-can-outline" size={24} color="#000" /> */}
        <Text style={styles.deleteText}>Hapus Akun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  deleteAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  logoutText: {
    color: '#FF3B30', // Red color for logout
  },
});

export default Setting;