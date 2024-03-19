import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BackButton} from '../../../assets/icons';

const PageHeader = ({label, backButton}) => {
  return (
    <View style={styles.container}>
      {backButton && <BackButton style={styles.backButton} />}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 24,
    paddingVertical: 37,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    color: '#020202',
  },
  backButton: {
    marginRight: 26,
  },
});