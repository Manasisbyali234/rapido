import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverEarningsScreen from '../screens/driver/DriverEarningsScreen';
import IncomingRideScreen from '../screens/driver/IncomingRideScreen';
import ActiveRideScreen from '../screens/driver/ActiveRideScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.greyLight,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons = { Rides: 'bicycle', Earnings: 'wallet' };
          return <Ionicons name={icons[route.name]} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rides" component={DriverHomeScreen} />
      <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverTabs} />
      <Stack.Screen name="IncomingRide" component={IncomingRideScreen} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
    </Stack.Navigator>
  );
}
