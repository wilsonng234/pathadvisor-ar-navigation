
import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, Button, Dimensions, ImageBackground, ImageStyle, Text } from 'react-native';
import { SearchBar } from '@rneui/themed';
import * as api from '../backend/';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Svg, { Polyline } from 'react-native-svg';
import { color } from '@rneui/base';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  pin: {
    width: '2%',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    resizeMode: 'contain',
  },
  MapView: {
    width: width,
    height: height,
  },
  searchBar: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // marginTop: '-2%',
    // backgroundColor: '#3A3E42'
  }
});
/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @returns 
 */

const SearchLocation = ({ placeholder, selectNode }) => {
  const [search, setSearch] = React.useState('');
  const [data, setData] = useState([]);
  const searchNodes = (s: string) => {
    setSearch(s);
    api.getNodesByName(s).then((res) => {
      setData(res["data"]);
    });
  }


  return (
    <>
      <SearchBar platform="ios" searchIcon={{ type: 'material', name: 'search' }} clearIcon={{ type: 'material', name: 'clear' }} containerStyle={styles.searchBar} placeholder={placeholder} onChange={(e) => searchNodes(e.nativeEvent.text)} value={search} showCancel={true} />
      <View>
        {
          //show search results
          data && data?.map((item: any, index: number) => (
            <Button key={index} title={item.name} onPress={() => {
              selectNode(item);
              setData([]);
              setSearch(item.name)
            }} />
          ))}
      </View>
    </>
  );
}
SearchLocation.propTypes = {
  placeholder: PropTypes.string.isRequired,
  selectNode: PropTypes.func.isRequired
};


/**
 * MapView component
 * 
 * @returns MapView component
*/
const MapView = () => {

  const [enableToSearchBar, setEnableToSearchBar] = useState(false);
  const [fromNode, setFromNode] = useState<any>(null);
  const [path, setPath] = useState({});
  const [floor, setFloor] = useState("G");
  // function to select "from" node
  const selectFromNode = (node: any) => {
    setFloor(node.floorId);
    setEnableToSearchBar(true);
    setFromNode(node);
  }
  // function to select "to" node
  const selectToNode = (node: any) => {
    api.getShortestPath(fromNode?._id, node?._id).then((res) => {
      res = res["data"];
      let path = {};
      res.map((res: any) => {
        if (path[res.floorId] === undefined) {
          path[res.floorId] = [];
        }
        path[res.floorId].push(res.coordinates);
      });
      setPath(path);
    });
  }

  return (
    <>
      <SearchLocation selectNode={selectFromNode} placeholder="Search for a location" />
      {enableToSearchBar && <SearchLocation selectNode={selectToNode} placeholder="Search to location" />}
      <FloorView floor={floor} node={fromNode} path={path} />
    </>
  );
};

/**
 * 
 * @param {string} floor floor id
 * @param node node of (from|to) for show the pin or zoom
 * @param zoomToPin zoom to the pin or not
 * @param {Map} path path to draw
 */
const FloorView = ({ floor, node, zoomToPin, path }) => {
  const zoomableViewRef = createRef<ReactNativeZoomableView>();


  const [mapSize, setMapSize] = useState({ height: 0, width: 0 });
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let startX = 0, startY = 0;
    api.getFloorById(floor).then((res) => {
      res = res["data"];
      startX = res.startX;
      startY = res.startY;
      setMapSize({ height: res.mapHeight, width: res.mapWidth });
    });
    api.getNodeById(node?._id).then((res) => {
      res = res["data"];
      setNodePosition({ x: res["centerCoordinates"][0] - startX, y: res["centerCoordinates"][1] - startY });

    });
  }, [floor, node, path]);
  return (

    <ReactNativeZoomableView
      ref={zoomableViewRef}
      maxZoom={1.5}
      minZoom={0.1}
      zoomStep={0.5}
      initialZoom={0.5}
      bindToBorders={true}
      contentHeight={mapSize.height}
      contentWidth={mapSize.width}
    >
      <ImageBackground 
      source={{
        uri: 'https://pathadvisor.ust.hk/api/floors/' + floor + '/map-image'
      }} 
      style={{ height: mapSize.height, width: mapSize.width, justifyContent: 'center', alignItems: 'center' }}>
        <Image 
        style={[styles.pin, { display: node ? 'flex' : 'none', left: nodePosition.x, top: nodePosition.y }]} 
        source={require('./assets/pin.png')} />

        {/* if width&height match map size the app will crash. So scale it*/}
        <View style={[{ 
          width: mapSize.width / 10, 
          height: mapSize.height / 10, 
          margin: 'auto', 
          transform: [{ scale: 10 }] }]}>
          <Svg viewBox={`0 0 ${mapSize.width} ${mapSize.height}`} height="100%" width="100%" >
            {path &&
              <Polyline points={path[floor]} stroke="red" strokeWidth="10" fill="none" />
            }
          </Svg>
        </View>
      </ImageBackground>
    </ReactNativeZoomableView>

  )
}
FloorView.propTypes = {
  floor: PropTypes.string.isRequired,
  node: PropTypes.object,
  zoomToPin: PropTypes.bool,
  path: PropTypes.object
};


export default MapView;