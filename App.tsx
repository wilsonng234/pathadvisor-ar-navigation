/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroARPlane,
  Viro3DObject,
  ViroAmbientLight,
  ViroScene,
  ViroFlexView
} from '@viro-community/react-viro';
import Arrow from './src/ar/components/arrow'
import Geolocation from '@react-native-community/geolocation';

const circleDiameter = Dimensions.get('window').width;

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');

  function onInitialized(state: ViroTrackingStateConstants, reason: any) {
    console.log('guncelleme', state, reason, typeof reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Hello World!');
      Geolocation.getCurrentPosition(info => console.log(info));
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
      <View style={{ width: '100%', height: '10%', zIndex: 999, position: 'absolute', elevation: (Platform.OS === 'android') ? 50 : 0 }}>
        <Text>Hello</Text>
      </View>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />
      <View style={styles.circle}>
      </View>
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
  circle: {
    height: circleDiameter / 2 * 1.4,
    width: circleDiameter * 1.2,
    borderTopLeftRadius: (circleDiameter / 2) * 1.2,
    borderTopRightRadius: (circleDiameter / 2) * 1.2,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
    flexDirection: 'column-reverse',
    display: 'flex'
  },
});
