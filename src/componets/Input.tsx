import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  isPassword?: boolean;
}

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  isPassword = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  if (isPassword) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            placeholder={placeholder}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            {/* <FontAwesome6
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="#999999"
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});

export default Input;