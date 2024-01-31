/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroARPlane,
  Viro3DObject,
  ViroAmbientLight
} from '@viro-community/react-viro';
import Arrow from './src/ar/components/arrow'

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');

  function onInitialized(state: ViroTrackingStateConstants, reason: any) {
    console.log('guncelleme', state, reason, typeof reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Hello World!');
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      {/* <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      /> */}
      <ViroARPlane minHeight={0.1} minWidth={0.1} alignment={'Horizontal'}>
        {/* <Viro3DObject
          source={require('./res/arrow.obj')}
          type="OBJ"
          position={[0.0, 0,0]}
          rotation={[0, 90, 0]}
          scale={[0.0005, 0.0005, 0.0005]}
        /> */}
        <Arrow x_cor={0.5} y_cor={0} direction={0} />
        <Arrow x_cor={0} y_cor={-0.5} direction={0} />
      </ViroARPlane>
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

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
