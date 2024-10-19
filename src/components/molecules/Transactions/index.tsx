import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  transactionContainer: {
    borderRadius: 5,
    padding: 8,
    borderColor: 'white',
  },
  transactionBottomShadow: {
    borderBottomWidth: 6, 
    borderBottomColor: 'rgba(0, 0, 0, 0.25)', 
    paddingVertical:12,
    borderRadius:10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  transactionDate: {
    fontSize: 14,
    color: '#777',
    fontWeight: 'normal',
    marginTop:21,
    left:44,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    right:8,
  },
  icon: {
    marginRight: 8,
  },
  botText: {
    fontSize: 14,
    color: 'black',
    marginTop :21,
    left:44,
  },
});

const LastTransactions = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Last 3 Transactions</Text>
      </View>
      <View
        style={(styles.transactionContainer, styles.transactionBottomShadow)}>
        <View style={styles.transactionRow}>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionDate}>17 April 2020</Text>
            <Text style={styles.botText}>Water, Food</Text>
          </View>
          <Text style={styles.transactionAmount}>-Rp. 300.000</Text>
        </View>
      </View>
      <View
        style={(styles.transactionContainer, styles.transactionBottomShadow)}>
        <View style={styles.transactionRow}>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionDate}>18 April 2020</Text>
            <Text style={styles.botText}>Office supplies</Text>
          </View>
          <Text style={styles.transactionAmount}>-Rp. 300.000</Text>
        </View>
      </View>
      <View
        style={(styles.transactionContainer, styles.transactionBottomShadow)}>
        <View style={styles.transactionRow}>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionDate}>19 April 2020</Text>
            <Text style={styles.botText}>Top Up</Text>
          </View>
          <Text style={[styles.transactionAmount, {color: '#1ABC9C'}]}>
            +Rp. 300.000
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LastTransactions;
