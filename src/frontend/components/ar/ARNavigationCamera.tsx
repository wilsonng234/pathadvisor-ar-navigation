import React from 'react';
import { StyleSheet } from 'react-native';
import {
    ViroARScene,
    ViroTrackingState,
    ViroTrackingStateConstants,
    ViroTrackingReason,
    ViroARSceneNavigator,
    ViroARPlane,
} from '@viro-community/react-viro';

import ARArrow from './ARArrow'

const HelloWorldSceneAR = () => {
    // const [text, setText] = useState('Initializing AR...');

    function onInitialized(state: ViroTrackingState, reason: ViroTrackingReason) {
        // console.log('guncelleme', state, reason, typeof reason);
        console.log("state:", state, " reason:", reason);

        if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
            // setText('Hello World!');
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
            style={styles.arSceneNavigator}
        />
    )
}

export default ARNavigationCamera;

const styles = StyleSheet.create({
    arSceneNavigator: { flex: 1 },
    helloWorldTextStyle: {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#ffffff',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});
