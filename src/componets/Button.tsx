import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, type = 'primary', style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'primary' ? styles.primaryButton : styles.textButton,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          type === 'primary' ? styles.primaryButtonText : styles.textButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#03A791',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  textButtonText: {
    color: '#03A791',
  },
});

export default Button;
