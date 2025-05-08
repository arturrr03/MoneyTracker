import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const BottomNavBar = ({ activeTab, onTabPress }: BottomNavBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('Home')}>
        <Image
          source={activeTab === 'Home' 
            ? require('../../assets/home-active.png')
            : require('../../assets/home.png')
          }
          style={styles.icon}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'Home' ? '#5CB85C' : '#999' },
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('Favorite')}>
        <Image
          source={activeTab === 'Favorite'
            ? require('../../assets/bookmark-active.png')
            : require('../../assets/bookmark.png')
          }
          style={[
            styles.icon,
            activeTab === 'Favorite' && styles.activeIcon
          ]}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'Favorite' ? '#000' : '#999' },
            activeTab === 'Favorite' && styles.activeTabLabel
          ]}>
          Saved
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('MyKost')}>
        <Image
          source={activeTab === 'MyKost'
            ? require('../../assets/building-active.png')
            : require('../../assets/building.png')
          }
          style={styles.icon}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'MyKost' ? '#5CB85C' : '#999' },
          ]}>
          MyKost
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('Profile')}>
        <Image
          source={activeTab === 'Profile'
            ? require('../../assets/user-active.png')
            : require('../../assets/user.png')
          }
          style={styles.icon}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'Profile' ? '#5CB85C' : '#999' },
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  activeIcon: {
    tintColor: '#000', // This will make the active icon black
  },
  activeTabLabel: {
    fontWeight: 'bold',
  },
});

export default BottomNavBar;