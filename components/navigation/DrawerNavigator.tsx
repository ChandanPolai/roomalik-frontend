// components/navigation/DrawerNavigator.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import BottomTabs from './BottomTabs';
import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Drawer ka header hide, tabs ka dikhega
        drawerPosition: 'left',
        swipeEnabled: true,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabs}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;