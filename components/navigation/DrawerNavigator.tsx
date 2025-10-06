// components/navigation/DrawerNavigator.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import BottomTabs from './BottomTabs';
import CustomDrawer from './CustomDrawer';
import NotificationScreen from '../../app/notification';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        swipeEnabled: true,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabs}
      />
      <Drawer.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          drawerItemStyle: { display: 'none' }, // Drawer menu me nahi dikhega
          swipeEnabled: false, // Swipe se nahi khulega
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;