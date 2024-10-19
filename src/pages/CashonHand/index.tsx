import {ScrollView, StyleSheet , View} from 'react-native';
import React from 'react';
import {
  PageHeader,
  Gap,
  TextInput,
  Button,
} from '../../components';
import Last3Transactions from '../../components/molecules/Transactions';

const CashonHand = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <PageHeader
        label="Cash On Hand"
        backButton={true}
        onPress={() => navigation.goBack()}
      />
      <Gap height={24} />
      <View style={styles.contentWrapper}>
        <View>
          <TextInput label="Description" placeholder="Add the description" />
        </View>
        <View style={{marginTop: 17}}>
          <TextInput label="Type" placeholder="Debit / Credit" />
        </View>
        <View style={{marginTop: 22}}>
          <Button label="save" />
        </View>
      </View>
      <Gap height={24} />
      <Last3Transactions />
    </ScrollView>
  );
};

export default CashonHand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    height: 296,
    paddingHorizontal: 24,
    paddingTop: 13,
  },
});