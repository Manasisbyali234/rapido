import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersListScreen from '../screens/admin/UsersListScreen';
import UserDetailScreen from '../screens/admin/UserDetailScreen';
import DriversListScreen from '../screens/admin/DriversListScreen';
import DriverDetailScreen from '../screens/admin/DriverDetailScreen';
import PendingCaptainsScreen from '../screens/admin/PendingCaptainsScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="UsersList" component={UsersListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="DriversList" component={DriversListScreen} />
      <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
      <Stack.Screen name="PendingCaptains" component={PendingCaptainsScreen} />
    </Stack.Navigator>
  );
}
