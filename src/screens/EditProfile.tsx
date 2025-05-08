import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { ref, get, set, update } from "firebase/database";
import { auth, database } from "../config/Firebase";
import * as ImagePicker from 'react-native-image-picker';
import { showMessage } from "react-native-flash-message";
import { signOut } from "firebase/auth";

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Login: undefined;
};

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    city: '',
    status: '',
    education: '',
    emergencyPhone: '',
    profileImage: null
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData({
            name: data.name || '',
            gender: data.gender || '',
            birthDate: data.birthDate || '',
            city: data.city || '',
            status: data.status || '',
            education: data.education || '',
            emergencyPhone: data.emergencyPhone || '',
            profileImage: data.profileImage || null
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to load user data',
        type: 'danger'
      });
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        await update(userRef, userData);
        
        showMessage({
          message: 'Success',
          description: 'Profile updated successfully',
          type: 'success'
        });
        
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to update profile',
        type: 'danger'
      });
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;

      if (response.errorCode) {
        showMessage({
          message: 'Error',
          description: response.errorMessage,
          type: 'danger'
        });
        return;
      }

      if (response.assets && response.assets[0].uri) {
        setUserData(prev => ({
          ...prev,
          profileImage: response.assets[0].uri
        }));
      }
    });
  };

  const openPicker = (pickerType: string, pickerOptions: string[]) => {
    setCurrentPicker(pickerType);
    setOptions(pickerOptions);
    setModalVisible(true);
  };

  const handleSelect = (value: string) => {
    setUserData(prev => ({
      ...prev,
      [currentPicker]: value
    }));
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Failed to logout',
        type: 'danger'
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Image 
            source={require('../../assets/backbutton.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          {userData.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.profilePicture}>
              {/* <Ionicons name="camera" size={32} color="#757575" /> */}
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.uploadText}>Upload Foto Profil</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          Nama Lengkap<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          value={userData.name}
          onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
        />

        <Text style={styles.label}>
          Jenis Kelamin<Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => openPicker('gender', ['Laki-laki', 'Perempuan'])}>
          <Text style={styles.dropdownText}>
            {userData.gender || 'Pilih jenis kelamin'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>
          Tanggal Lahir<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan tanggal lahir"
          value={userData.birthDate}
          onChangeText={(text) => setUserData(prev => ({ ...prev, birthDate: text }))}
        />

        <Text style={styles.label}>Kota Asal</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan kota asal"
          value={userData.city}
          onChangeText={(text) => setUserData(prev => ({ ...prev, city: text }))}
        />

        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => openPicker('status', ['Pelajar', 'Pekerja'])}>
          <Text style={styles.dropdownText}>{userData.status || 'Pilih status'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Pendidikan Terakhir</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            openPicker('education', ['SMA', 'Diploma', 'Sarjana'])
          }>
          <Text style={styles.dropdownText}>
            {userData.education || 'Pilih pendidikan terakhir'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>No. Handphone Darurat</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nomor handphone darurat"
          value={userData.emergencyPhone}
          onChangeText={(text) => setUserData(prev => ({ ...prev, emergencyPhone: text }))}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3F51B5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#757575',
  },
  form: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#757575',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 32,
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#212121',
  },
});

export default EditProfile;