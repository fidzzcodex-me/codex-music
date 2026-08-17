import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet} from 'react-native';
import {Search, Library, Heart} from 'lucide-react-native';
import {colors} from '@theme/colors';
import SearchScreen from '@screens/SearchScreen';
import LibraryScreen from '@screens/LibraryScreen';
import FavoritesScreen from '@screens/FavoritesScreen';
import PlayerScreen from '@screens/PlayerScreen';
import PlaylistDetailScreen from '@screens/PlaylistDetailScreen';
import LyricsScreen from '@screens/LyricsScreen';
import MiniPlayer from '@components/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsWithMiniPlayer() {
  return (
    <View style={styles.flex}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({color, size}) => <Search color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarIcon: ({color, size}) => <Library color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({color, size}) => <Heart color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={TabsWithMiniPlayer} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{presentation: 'modal', animation: 'slide_from_bottom'}}
        />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
        <Stack.Screen
          name="Lyrics"
          component={LyricsScreen}
          options={{presentation: 'modal', animation: 'slide_from_bottom'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
