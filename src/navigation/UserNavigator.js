import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

import PhoneLoginScreen from '../screens/user/PhoneLoginScreen';
import OtpScreen from '../screens/user/OtpScreen';
import HomeScreen from '../screens/user/HomeScreen';
import RideHistoryScreen from '../screens/user/RideHistoryScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import FindingDriverScreen from '../screens/user/FindingDriverScreen';
import RideTrackingScreen from '../screens/user/RideTrackingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.greyLight,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: 'home', Rides: 'time', Profile: 'person' };
          return <Ionicons name={icons[route.name]} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rides" component={RideHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="UserHome" component={UserTabs} />
      <Stack.Screen name="Finding" component={FindingDriverScreen} />
      <Stack.Screen name="Tracking" component={RideTrackingScreen} />
    </Stack.Navigator>
  );
}
