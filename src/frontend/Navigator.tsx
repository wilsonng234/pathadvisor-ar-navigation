import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert, AlertButton } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/Home';
import BusQueueStatisticsScreen from './screens/BusQueueStatistics';
import EventScreen from './screens/Event';
import ARNavigationScreen from './screens/ARNavigation';
import useGetMetaVersion from './hooks/api/useGetMetaVersion';
import {
    storage, StorageKeys,
    getBuildingsDict, getFloorsDict, getNodesByFloorDict, getTagsDict, getMapTilesByFloorDict,
    BuildingsDict, FloorsDict, TagsDict, NodeByFloorDict, MapTilesByFloorDict
} from './utils/storage_utils';

const Drawer = createDrawerNavigator();

const Navigator = () => {
    const [startDownload, setStartDownload] = useState<boolean>(false);
    const { data: metaVersion, isLoading: isLoadingMetaVerison } = useGetMetaVersion();

    useEffect(() => {
        const downloadMapData = async () => {
            if (!metaVersion) {
                console.error('Meta version not found');
                return;
            }

            const buildings: BuildingsDict = await getBuildingsDict();
            const floors: FloorsDict = await getFloorsDict();
            const tags: TagsDict = await getTagsDict();
            const nodesByFloor: NodeByFloorDict = await getNodesByFloorDict(floors);
            const mapTilesByFloor: MapTilesByFloorDict = await getMapTilesByFloorDict(floors);

            storage.set(StorageKeys.BUILDINGS, JSON.stringify(buildings));
            storage.set(StorageKeys.FLOORS, JSON.stringify(floors));
            storage.set(StorageKeys.TAGS, JSON.stringify(tags));
            storage.set(StorageKeys.NODES_BY_FLOOR, JSON.stringify(nodesByFloor));
            storage.set(StorageKeys.MAPTILES_BY_FLOOR, JSON.stringify(mapTilesByFloor));
            storage.set(StorageKeys.META_VERSION, metaVersion);
            Alert.alert('Downloaded map data', 'The HKUST Map data has been downloaded successfully.');
        }

        if (startDownload) {
            downloadMapData();
        }
    }, [startDownload]);

    const downloadMapTileAlert = () => {
        const downloadedMetaVersion = storage.getString(StorageKeys.META_VERSION);
        let title: string, message: string, buttons: AlertButton[];

        if (!downloadedMetaVersion) {
            title = 'Download HKUST Map data';
            message = 'Do you want to download the HKUST Map data?';
            buttons = [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => setStartDownload(true) },
            ];
        }
        else {
            if (downloadedMetaVersion === metaVersion) {
                title = 'Update HKUST Map data';
                message = 'The HKUST Map data is up to date.';
                buttons = [
                    {
                        text: 'OK',
                    },
                ];
            }
            else {
                title = 'Update HKUST Map data';
                message = 'Do you want to update the HKUST Map data to latest version?';
                buttons = [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => setStartDownload(true) },
                ];
            }
        }

        Alert.alert(title, message, buttons);
    }

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: 'front', swipeEdgeWidth: 0 }}>
                <Drawer.Screen name="Home" component={HomeScreen}
                    options={{
                        headerTitle: 'HKUST PathAdvisor',
                        headerTitleAlign: 'center',
                        headerRight: () => {
                            return (
                                !isLoadingMetaVerison && <TouchableOpacity onPress={downloadMapTileAlert} >
                                    <MaterialIcons
                                        name="update"
                                        style={{ marginRight: 10 }}
                                        size={25}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            )
                        },
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
        </NavigationContainer >
    )
}

export default Navigator;
