import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { QueryClient } from '@tanstack/react-query';

import HomeScreen from './src/frontend/screens/Home';
import BusQueueStatisticsScreen from './src/frontend/screens/BusQueueStatistics';
import EventScreen from './src/frontend/screens/Event';
import ARNavigationScreen from './src/frontend/screens/ARNavigation';
import { storage } from './src/frontend/utils/mmkvStorage';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const Drawer = createDrawerNavigator();

const clientStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key) => {
    storage.delete(key);
  },
};
const queryClient = new QueryClient()
const clientPersister = createSyncStoragePersister({ storage: clientStorage });

function App(): React.JSX.Element {
  console.log(storage.getAllKeys());
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
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: 'front', swipeEdgeWidth: 0 }}>
            <Drawer.Screen name="Home" component={HomeScreen}
              options={{
                headerTitle: 'HKUST PathAdvisor',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <TouchableOpacity onPress={downloadMapTileAlert}>
                    <MaterialIcons
                      name="update"
                      style={{ marginRight: 10 }}
                      size={25}
                      color={'black'}
                    />
                  </TouchableOpacity>
                ),
              }}
            />
            <Drawer.Screen name="Events"
              component={EventScreen}
              options={{ headerTitleAlign: 'center', }}
            />
            <Drawer.Screen name="Bus Queue Statistics"
              component={BusQueueStatisticsScreen}
              options={{ headerTitleAlign: 'center', }}
            />
            <Drawer.Screen name="AR Navigation"
              component={ARNavigationScreen}
              options={{ headerShown: false, drawerItemStyle: { display: 'none' } }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
