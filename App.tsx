import React, {useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SuccessSignUpScreen from './src/screens/SuccessSignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import BottomNavBar from './src/componets/BottomNavBar'; 
import MyKostScreen from './src/screens/MyKostScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import ViewedScreen from './src/screens/ViewedScreens';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingScreen from './src/screens/SettingScreen'; // Ganti dengan layar yang sesuai
import EditProfileScreen from './src/screens/EditProfile'; // Ganti dengan layar yang sesuai
import FlashMessage from 'react-native-flash-message';
import {View, StyleSheet} from 'react-native';
import './src/config/Firebase'
const Stack = createNativeStackNavigator();

function MainNavigator({navigation}: any) {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName); // Navigasi ke layar berdasarkan tabName
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Saved':
        return <FavoriteScreen />;
      case 'MyKost':
        return <MyKostScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 1.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showSplash ? 'Splash' : 'Main'}
          screenOptions={{
            headerShown: false,
          }}>

          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SuccessSignUp" component={SuccessSignUpScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="MyKost" component={MyKostScreen} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} />
          <Stack.Screen name="Viewed" component={ViewedScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />  
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
         
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderScreen: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

export default App;




