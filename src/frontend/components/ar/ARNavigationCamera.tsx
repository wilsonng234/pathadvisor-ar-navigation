import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    ViroARScene,
    ViroTrackingState,
    ViroTrackingStateConstants,
    ViroTrackingReason,
    ViroARSceneNavigator,
    ViroARPlane,
    ViroCamera,
    ViroCameraTransform,
    ViroNode
} from '@viro-community/react-viro';

import ARArrow from './ARArrow'

const HelloWorldSceneAR = () => {
    const sceneRef = useRef<ViroARScene | null>(null);
    // const [text, setText] = useState('Initializing AR...');

    const onInitialized = (state: ViroTrackingState, reason: ViroTrackingReason) => {
        // console.log('guncelleme', state, reason, typeof reason);
        console.log("state:", state, " reason:", reason);

        if (sceneRef.current) {
            sceneRef.current.getCameraOrientationAsync().then((orientation) => {
                console.log('orientation:', orientation);
            }).catch((error) => {
                console.log('error:', error);
            });
        }

        if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
            // setText('Hello World!');
            // Geolocation.getCurrentPosition(info => console.log(info));
        } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
            // Handle loss of tracking
        }
    }
    const [prevPos, setPrevPos] = useState<ViroCameraTransform | null>(null)

    return (
        <ViroARScene ref={sceneRef} onTrackingUpdated={onInitialized} onCameraTransformUpdate={(cameraTransform) => {
            if (prevPos !== null) {
                let upDiff = (cameraTransform.forward[0] - prevPos.forward[0])
                if (upDiff < 0.001) {
                    upDiff = 0
                }
                console.log(upDiff)
            }
            setPrevPos(cameraTransform)
        }
        }>
            {/* <ViroARPlane minHeight={0.1} minWidth={0.1} alignment={'Horizontal'}>
                <ARArrow x_cor={0} y_cor={-0.1} z_cor={0} direction={0} />
                <ARArrow x_cor={0} y_cor={-1.5} z_cor={0} direction={2} />
            </ViroARPlane> */}

            <ViroNode position={[0, 0, 0]}>
                <ViroCamera position={[0, 0, 0]} active={true} >
                    <ARArrow x_cor_start={0} y_cor_start={-0.5} x_cor_dest={-0.04} y_cor_dest={2} />
                </ViroCamera>
            </ViroNode>
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
