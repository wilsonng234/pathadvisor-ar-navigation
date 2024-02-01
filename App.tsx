/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MapView from './src/frontend/MapView';
import { SafeAreaView, StyleSheet } from 'react-native';

function App(): React.JSX.Element {
  return (
    <>
      <SafeAreaView style={styles.safe_area} />
      <MapView />
    </>
  );
}
export default App;


const styles = StyleSheet.create({
  safe_area: {
    flex: 0,
    backgroundColor: '#3A3E42'
  }
});

