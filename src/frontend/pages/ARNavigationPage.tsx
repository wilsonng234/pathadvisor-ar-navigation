import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import TopNavigationBar from '../components/ar/top-navigation-bar';
import BottomNavigationBar from '../components/ar/bottom-navigation-bar';
import ARNavigationCamera from '../components/ar/arNavigationCamera';

const ARNavigationPage = ({ navigation }) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TopNavigationBar latitude={22.396427} longitude={114.109497} handleExitArNavigationPage={() => navigation.goBack()} />
            <ARNavigationCamera />
            <BottomNavigationBar />
        </GestureHandlerRootView>
    );
}

export default ARNavigationPage;
