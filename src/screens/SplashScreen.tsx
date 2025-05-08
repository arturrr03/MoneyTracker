import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions, StatusBar} from 'react-native';

const {width} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require('../../assets/cozykost.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
  },
});

export default SplashScreen;
