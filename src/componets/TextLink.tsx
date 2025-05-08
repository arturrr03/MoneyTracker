import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';

interface TextLinkProps extends TouchableOpacityProps {
  text: string;
  style?: object;
  textStyle?: object;
}

const TextLink = ({text, style, textStyle, ...props}: TextLinkProps) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 14,
    color: '#5CB85C',
    fontWeight: 'bold',
  },
});

export default TextLink;