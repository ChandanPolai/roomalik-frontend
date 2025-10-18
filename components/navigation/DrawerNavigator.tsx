// components/navigation/DrawerNavigator.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import CustomDrawer from './CustomDrawer';

// Import all screens
import HelpSupportScreen from '../../app/help-support';
import NotificationScreen from '../../app/notification';
import PaymentScreen from '../../app/payment';
import PrivacyPolicyScreen from '../../app/privacy-policy';
import ProfileScreen from '../../app/profile';
import TermsConditionsScreen from '../../app/terms-conditions';
import EditProfileScreen from '../../app/edit-profile';
import ChangePasswordScreen from '../../app/change-password';

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
      {/* Main Tabs - Home, Plots, Rooms, Tenants */}
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabs}
      />

      {/* Hidden Screens - Drawer se navigate honge */}
      <Drawer.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="TermsConditionsScreen"
        component={TermsConditionsScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="HelpSupportScreen"
        component={HelpSupportScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      
      <Drawer.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;