import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/Home';
import BusQueueStatisticsScreen from './screens/BusQueueStatistics';
import EventScreen from './screens/Event';
import ARNavigationScreen from './screens/ARNavigation';
import { Alert } from 'react-native';

const Drawer = createDrawerNavigator();

const Navigator = () => {
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
    )
}

export default Navigator;
