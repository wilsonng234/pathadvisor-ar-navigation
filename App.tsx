/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MapView from './src/frontend/MapView';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, useSafeAreaInsets, } from 'react-native-safe-area-context';
import PathAdvisorPage from './src/frontend/pages/PathAdvisorPage';
import EventPage from './src/frontend/pages/EventPage';
import BusQueueStatPage from './src/frontend/pages/BusQueueStatPage';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
// const insets = useSafeAreaInsets();

// function HomeScreen() {
//   return (
//     <>
//       <MapView />
//       <View style={styles.mapDrawerOverlay} />
//     </>
//   );
// }

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

// function CustomDrawerContent(props) {
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem label="Help" onPress={() => alert('Link to help')} />
//     </DrawerContentScrollView>
//   );
// }

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <Drawer.Navigator initialRouteName="Main Page" drawerContent={(props) => <CustomDrawerContent {...props} />} > */}
        <Drawer.Navigator initialRouteName="HKUST PathAdvisor">
          <Drawer.Screen name="HKUST PathAdvisor" component={PathAdvisorPage} options={{ drawerLabel: 'PathAdvisor Map', }} />
          <Drawer.Screen name="Events" component={EventPage} />
          <Drawer.Screen name="Bus Queue Statistics" component={BusQueueStatPage} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;


const styles = StyleSheet.create({
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: Dimensions.get('window').height,
    width: '5%',
  }
});

