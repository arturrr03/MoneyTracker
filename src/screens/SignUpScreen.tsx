import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Input from '../componets/Input';
import Button from '../componets/Button';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../config/Firebase";
import { showMessage } from "react-native-flash-message";

const FONTS = {
  REGULAR: 'Geist-Regular',
  MEDIUM: 'Geist-Medium',
  BOLD: 'Geist-Bold',
  SEMIBOLD: 'Geist-SemiBold',
};

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !name || !phone) {
      showMessage({
        message: "Error",
        description: "All fields are required",
        type: "danger",
      });
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      const userId = userCredential.user.uid;

      // Save user data to Realtime Database
      await set(ref(database, 'users/' + userId), {
        name: name,
        email: email,
        phone: phone,
        password: password,// Add phone field in signup form
        createdAt: new Date().toISOString(),
        // Add any additional user data you want to store
      });

      showMessage({
        message: "Success",
        description: "Account created successfully! Please sign in.",
        type: "success",
        duration: 3000,
      });

      navigation.navigate("Login");
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#1E1E1E" barStyle="light-content" /> */}

      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/cozykost.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Name"
            placeholder="Type your name"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Email"
            placeholder="Type your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Phone"
            placeholder="Type your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            placeholder="Type your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="SIGN UP"
            onPress={handleSignUp}
            type="primary"
            style={styles.signUpButton}
          />

          <Button
            title="Back to Sign In"
            onPress={() => navigation.goBack()}
            type="secondary"
          />
        </View>
      </View>
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
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    marginBottom: 30,
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: '#000000',
  },
  signUpButton: {
    marginTop: 20,
  },
});

export default SignUpScreen;
