import React, { useEffect } from 'react';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PathAdvisorPage from './src/frontend/pages/PathAdvisor';
import EventPage from './src/frontend/pages/Event';
import BusQueueStatPage from './src/frontend/pages/BusQueueStat';
import ARNavigationPage from './src/frontend/pages/ARNavigation';
import QRCodeScanning from './src/frontend/pages/QRCodeScanning';

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

interface QRCodeDataInterface {
  x: number,
  y: number,
  floor: string,
  building: string,
  orientation: number,
  id: string,
  name: string
}

function App(): React.JSX.Element {
  const [qrCodeData, setQRCodeData] = React.useState<QRCodeDataInterface | null>(null)

  useEffect(() => {
    console.log(qrCodeData)
  },[qrCodeData])

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <Drawer.Navigator initialRouteName="Main Page" drawerContent={(props) => <CustomDrawerContent {...props} />} > */}
        <Drawer.Navigator initialRouteName="HKUST PathAdvisor">
          <Drawer.Screen name="HKUST PathAdvisor" component={PathAdvisorPage} options={{ drawerLabel: 'PathAdvisor Map', }} />
          <Drawer.Screen name="Events" component={EventPage} />
          <Drawer.Screen name="Bus Queue Statistics" component={BusQueueStatPage} />
          <Drawer.Screen name="AR Navigation" component={ARNavigationPage} options={{ headerShown: false }} />
          <Drawer.Screen name="QRCode Scan" component={() => <QRCodeScanning setQRCodeData={setQRCodeData} />} />
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
