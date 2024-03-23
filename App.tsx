import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PathAdvisorPage from './src/frontend/pages/PathAdvisorPage';
import EventPage from './src/frontend/pages/EventPage';
import BusQueueStatPage from './src/frontend/pages/BusQueueStatPage';
import ARNavigationPage from './src/frontend/pages/ARNavigationPage';

const Drawer = createDrawerNavigator();
// const insets = useSafeAreaInsets();

const queryClient = new QueryClient()

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="HKUST PathAdvisor">
            <Drawer.Screen name="HKUST PathAdvisor" component={PathAdvisorPage} options={{ drawerLabel: 'PathAdvisor Map', }} />
            <Drawer.Screen name="Events" component={EventPage} />
            <Drawer.Screen name="Bus Queue Statistics" component={BusQueueStatPage} />
            <Drawer.Screen name="AR Navigation" component={ARNavigationPage} options={{ headerShown: false }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
