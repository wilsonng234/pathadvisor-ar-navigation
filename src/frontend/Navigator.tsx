import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ActivityIndicator, Alert, AlertButton } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/Home';
import BusQueueStatisticsScreen from './screens/BusQueueStatistics';
import EventScreen from './screens/Event';
import ARNavigationScreen from './screens/ARNavigation';
import useGetMetaVersion from './hooks/api/useGetMetaVersion';
import Node from '../backend/schema/node';
import {
    storage, StorageKeys,
    getBuildingsDict, getFloorsDict, getNodesByFloorDict, getTagsDict, getMapTilesByFloorDict,
    BuildingsDict, FloorsDict, TagsDict, NodeByFloorDict, MapTilesByFloorDict
} from './utils/storage_utils';

export type RootStackParamList = {
    Home: undefined;
    Event: undefined;
    'Bus Queue Statistics': undefined;
    'AR Navigation': { toNode: Node };
};

const Drawer = createDrawerNavigator();

enum DownloadState {
    NOT_DOWNLOADED,
    DOWNLOADING,
    OUT_DATED,
    UPDATED
}

const Navigator = () => {
    const [downloading, setDownloading] = useState<boolean>(false);
    const { data: metaVersion, isLoading: isLoadingMetaVerison } = useGetMetaVersion();
    const downloadState = useMemo(() => {
        const currentVersion = storage.getString(StorageKeys.META_VERSION);
        if (!metaVersion)
            return DownloadState.NOT_DOWNLOADED;

        if (downloading)
            return DownloadState.DOWNLOADING;
        if (!currentVersion)
            return DownloadState.NOT_DOWNLOADED;

        if (metaVersion !== currentVersion)
            return DownloadState.OUT_DATED;
        else
            return DownloadState.UPDATED;
    }, [metaVersion, downloading]);

    useEffect(() => {
        const downloadMapData = async () => {
            if (!metaVersion) {
                console.error('Meta version not found');
                return;
            }

            const startTime = Date.now();
            console.debug('Downloading map data...');

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

            const endTime = Date.now();
            console.debug('Downloaded map data', `Time elapsed: ${(endTime - startTime) / 1000} seconds`);

            setDownloading(false);
        }

        if (downloading) {
            downloadMapData();
        }
    }, [downloading]);

    const downloadMapTileAlert = () => {
        let title: string, message: string, buttons: AlertButton[];

        switch (downloadState) {
            case DownloadState.NOT_DOWNLOADED:
                title = 'Download HKUST Map data';
                message = 'Do you want to download the HKUST Map data?';
                buttons = [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => setDownloading(true) },
                ];
                break;
            case DownloadState.DOWNLOADING:
                title = 'Downloading HKUST Map data';
                message = 'Downloading HKUST Map data...';
                buttons = [
                    {
                        text: 'OK',
                    },
                ];
                break;
            case DownloadState.OUT_DATED:
                title = 'Update HKUST Map data';
                message = 'Do you want to update the HKUST Map data to latest version?';
                buttons = [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => setDownloading(true) },
                ];
                break;
            case DownloadState.UPDATED:
                title = 'Update HKUST Map data';
                message = 'The HKUST Map data is up to date.';
                buttons = [
                    {
                        text: 'OK',
                    },
                ];
                break;
        }

        Alert.alert(title, message, buttons);
    }

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: 'front', swipeEdgeWidth: 0 }}>
                <Drawer.Screen name="Home"
                    component={HomeScreen}
                    options={{
                        headerTitle: 'HKUST PathAdvisor',
                        headerTitleAlign: 'center',
                        headerRight: () => {
                            return (
                                <TouchableOpacity onPress={downloadMapTileAlert}>
                                    {
                                        downloadState === DownloadState.DOWNLOADING ?
                                            <ActivityIndicator style={{ marginRight: 10 }} size={25} color="black" /> :
                                            <MaterialIcons
                                                name={downloadState === DownloadState.UPDATED ? "check" : "update"}
                                                style={{ marginRight: 10 }}
                                                size={25}
                                                color={'black'}
                                            />
                                    }
                                </TouchableOpacity>
                            )
                        },
                    }}
                />
                <Drawer.Screen name="Event"
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
