import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminLoginScreen      from '../screens/admin/AdminLoginScreen';
import AdminDashboardScreen  from '../screens/admin/AdminDashboardScreen';
import UsersListScreen       from '../screens/admin/UsersListScreen';
import UserDetailScreen      from '../screens/admin/UserDetailScreen';
import AdminUserRideTrackingScreen from '../screens/admin/AdminUserRideTrackingScreen';
import DriversListScreen     from '../screens/admin/DriversListScreen';
import DriverDetailScreen    from '../screens/admin/DriverDetailScreen';
import PendingCaptainsScreen from '../screens/admin/PendingCaptainsScreen';
import { colors, radius }    from '../theme/theme';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── per-tab stacks so each tab has its own navigation history ──

const backButton = (navigation) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 4, padding: 4 }}>
    <Ionicons name="arrow-back" size={22} color={colors.black} />
  </TouchableOpacity>
);

const detailScreenOptions = ({ navigation }) => ({
  headerShown: true,
  headerTitle: '',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.white },
  headerLeft: () => backButton(navigation),
});

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="DriverDetail"   component={DriverDetailScreen}   options={detailScreenOptions} />
    </Stack.Navigator>
  );
}

function UsersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersList"  component={UsersListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} options={detailScreenOptions} />
      <Stack.Screen name="AdminUserRideTracking" component={AdminUserRideTrackingScreen}
        options={({ navigation }) => ({
          headerShown: true, headerTitle: 'Ride Tracking',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.white },
          headerLeft: () => backButton(navigation),
        })}
      />
    </Stack.Navigator>
  );
}

function DriversStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriversList"  component={DriversListScreen} />
      <Stack.Screen name="DriverDetail" component={DriverDetailScreen} options={detailScreenOptions} />
    </Stack.Navigator>
  );
}

function PendingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PendingCaptains" component={PendingCaptainsScreen} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Dashboard: focused ? 'grid'        : 'grid-outline',
            Users:     focused ? 'people'      : 'people-outline',
            Drivers:   focused ? 'bicycle'     : 'bicycle-outline',
            Pending:   focused ? 'time'        : 'time-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
        tabBarIndicatorStyle: { backgroundColor: colors.yellow },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Users"     component={UsersStack} />
      <Tab.Screen name="Drivers"   component={DriversStack} />
      <Tab.Screen name="Pending"   component={PendingStack} />
    </Tab.Navigator>
  );
}

// ── root stack: Login → Tabs ──
export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminTabs"  component={AdminTabs} />
    </Stack.Navigator>
  );
}
