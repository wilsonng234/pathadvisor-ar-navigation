import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ARTopNavigationBar from '../components/ar/ARTopNavigationBar';
import ARBottomNavigationBar from '../components/ar/ARBottomNavigationBar';
import ARNavigationCamera from '../components/ar/ARNavigationCamera';

const ARNavigationPage = ({ navigation }) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ARTopNavigationBar latitude={22.396427} longitude={114.109497} handleExitArNavigationPage={() => navigation.goBack()} />
            <ARNavigationCamera />
            {/* <ARBottomNavigationBar /> */}
        </GestureHandlerRootView>
    );
}

export default ARNavigationPage;
