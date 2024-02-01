/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroARPlane,
} from '@viro-community/react-viro';
import Geolocation from '@react-native-community/geolocation';

import Arrow from './src/ar/components/arrow'
import TopNavigationBar from './src/ar/components/top-navigation-bar';
import BottomNavigationBar from './src/ar/components/bottom-navigation-bar';

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
        <Arrow x_cor={0} y_cor={-0.1} direction={0} />
        <Arrow x_cor={0} y_cor={-1.5} direction={2} />
      </ViroARPlane>
    </ViroARScene>
  );
};

export default () => {
  return (
    <View style={{ flex: 1 }}>
      <TopNavigationBar latitude={22.396427} longitude={114.109497} />
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />
      <BottomNavigationBar />
    </View>
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
