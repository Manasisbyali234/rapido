import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegisterUserScreen from '../screens/auth/RegisterUserScreen';
import RegisterCaptainScreen from '../screens/auth/RegisterCaptainScreen';
import OtpVerifyScreen from '../screens/auth/OtpVerifyScreen';
import SuccessScreen from '../screens/auth/SuccessScreen';
import CaptainPendingScreen from '../screens/auth/CaptainPendingScreen';

import UserNavigator from './UserNavigator';
import DriverNavigator from './DriverNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      RegisterUser: 'register/user',
      RegisterCaptain: 'register/captain',
      OtpVerify: 'otp-verify',
      SuccessScreen: 'success',
      CaptainPending: 'captain-pending',
      User: {
        path: 'user',
        screens: {
          UserHome: {
            path: '',
            screens: {
              Home: 'home',
              Rides: 'rides',
              Profile: 'profile',
            },
          },
          Finding: 'finding-driver',
          Tracking: 'tracking',
        },
      },
      Driver: {
        path: 'captain',
        screens: {
          DriverHome: {
            path: '',
            screens: {
              Rides: 'rides',
              Earnings: 'earnings',
            },
          },
          IncomingRide: 'incoming-ride',
          ActiveRide: 'active-ride',
        },
      },
      Admin: {
        path: 'admin',
        screens: {
          AdminLogin: 'login',
          AdminTabs: {
            path: '',
            screens: {
              Dashboard: {
                path: 'dashboard',
                screens: {
                  AdminDashboard: '',
                  DriverDetail: 'driver/:id',
                },
              },
              Users: {
                path: 'users',
                screens: {
                  UsersList: '',
                  UserDetail: ':id',
                },
              },
              Drivers: {
                path: 'drivers',
                screens: {
                  DriversList: '',
                  DriverDetail: ':id',
                },
              },
              Pending: {
                path: 'pending',
                screens: {
                  PendingCaptains: '',
                },
              },
            },
          },
        },
      },
    },
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen name="RegisterCaptain" component={RegisterCaptainScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="CaptainPending" component={CaptainPendingScreen} />

        {/* App stacks */}
        <Stack.Screen name="User" component={UserNavigator} />
        <Stack.Screen name="Driver" component={DriverNavigator} />
        <Stack.Screen name="Admin" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
