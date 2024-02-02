/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TopNavigationBar from './src/ar/components/top-navigation-bar';
import BottomNavigationBar from './src/ar/components/bottom-navigation-bar';
import ARNavigationCamera from './src/ar/components/arNavigationCamera';

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TopNavigationBar latitude={22.396427} longitude={114.109497} handleExitArPage={() => console.log("Exit")} />
      <ARNavigationCamera />
      <BottomNavigationBar />
    </GestureHandlerRootView>
  );
};
