/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import TopNavigationBar from './src/ar/components/top-navigation-bar';
import BottomNavigationBar from './src/ar/components/bottom-navigation-bar';
import ARNavigationCamera from './src/ar/components/arNavigationCamera';

export default () => {
  return (
    <View style={{ flex: 1 }}>
      <TopNavigationBar latitude={22.396427} longitude={114.109497} />
      <ARNavigationCamera />
      <BottomNavigationBar />
    </View>
  );
};
