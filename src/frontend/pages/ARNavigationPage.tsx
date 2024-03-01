import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import TopNavigationBar from '../../ar/components/top-navigation-bar';
import BottomNavigationBar from '../../ar/components/bottom-navigation-bar';
import ARNavigationCamera from '../../ar/components/arNavigationCamera';

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
