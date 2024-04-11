import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/frontend/screens/Home';
import BusQueueScreen from './src/frontend/screens/BusQueue';
import EventScreen from './src/frontend/screens/Event';
import ARNavigationScreen from './src/frontend/screens/ARNavigation';
import { Alert, Button, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();
// const insets = useSafeAreaInsets();

const queryClient = new QueryClient()

function App(): React.JSX.Element {

  const downloadMapTileAlert = () =>
  //warning message
    Alert.alert('Update HKUST Map data', 'Do you want to update the HKUST Map data to latest version?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: 'front', swipeEdgeWidth: 0 }}>
            <Drawer.Screen name="Home" component={HomeScreen}
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={downloadMapTileAlert}>
                    <MaterialIcons
                      name="update"
                      style={{ marginRight: 10 }}
                      size={25} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Drawer.Screen name="Events" component={EventScreen} />
            <Drawer.Screen name="Bus Queue" component={BusQueueScreen} />
            <Drawer.Screen name="AR Navigation" component={ARNavigationScreen} options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
