import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    ViroARScene,
    ViroTrackingStateConstants,
    ViroARSceneNavigator,
    ViroARPlane,
} from '@viro-community/react-viro';

import ARArrow from './ARArrow'

const HelloWorldSceneAR = () => {
    const [text, setText] = useState('Initializing AR...');

    function onInitialized(state: ViroTrackingStateConstants, reason: any) {
        console.log('guncelleme', state, reason, typeof reason);
        if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
            setText('Hello World!');
            // Geolocation.getCurrentPosition(info => console.log(info));
        } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
            // Handle loss of tracking
        }
    }
    return (
        <ViroARScene onTrackingUpdated={onInitialized}>
            <ViroARPlane minHeight={0.1} minWidth={0.1} alignment={'Horizontal'}>
                <ARArrow x_cor={0} y_cor={-0.1} direction={0} />
                <ARArrow x_cor={0} y_cor={-1.5} direction={2} />
            </ViroARPlane>
        </ViroARScene>
    );
};

const ARNavigationCamera = () => {
    return (
        <ViroARSceneNavigator
            autofocus={true}
            initialScene={{
                scene: HelloWorldSceneAR,
            }}
            style={styles.f1}
        />
    )
}

export default ARNavigationCamera;

var styles = StyleSheet.create({
    f1: { flex: 1 },
    helloWorldTextStyle: {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#ffffff',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});
