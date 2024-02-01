
import React, { createRef, useState } from 'react';
import { Image, StyleSheet, Text, View, Button, Dimensions, ImageBackground } from 'react-native';
import { SearchBar } from '@rneui/themed';
import * as api from '../backend/';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
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
  border: {
    borderColor: 'red',
    borderWidth: 1,
  }
});

//show search results
const SearchLocation = (props: any) => {
  const [search, setSearch] = React.useState('');
  const [data, setData] = useState([]);
  const searchNodes = (s: string) => {
    setSearch(s);
    api.getNodesByName(s).then((res) => {
      setData(res["data"]);
    });
  }


  return (

    <View>

      <SearchBar placeholder={props.placeholder} onChange={(e) => searchNodes(e.nativeEvent.text)} value={search} />
      <View>
        {
          data && data?.map((item: any, index: number) => (
            <Button key={index} title={item.name} onPress={() => { props.selectNode(item, props.type); setData([]) }} />
          ))}

      </View>
    </View>
  );
}

const MapView = () => {

  const [mapImg, setMapImg] = useState("G");
  const [pinPos, setPinPos] = useState({ display: 'none', left: 0, top: 0 });
  const [mapSize, setMapSize] = useState({ width: 4800, height: 3400 });
  const [toSearchBar, setToSearchBar] = useState(false);
  const [fromNode, setFromNode] = useState({});
  const [toNode, setToNode] = useState({});
  const zoomableViewRef = createRef<ReactNativeZoomableView>();

  const selectNode = (node: any, type: any) => {
    if (type == "from") {
      setFromNode(node);
      setToSearchBar(true);
    }
    else if (type == "to") {
      setToNode(node);
      api.getShortestPath(fromNode._id, node._id).then((res) => {
        res = res["data"];
        console.log(res);
      });
    }
    setToSearchBar(true);
    let floorId = node.floorId;
    let startX = 0;
    let startY = 0;
    api.getFloor(floorId).then((res) => {
      res = res["data"];
      setMapSize({ width: res["mapWidth"], height: res["mapHeight"] });
      startX = res["startX"];
      startY = res["startY"];
    });
    api.getNodeById(node._id).then((res) => {
      res = res["data"];
      setMapImg(floorId);

      //todo: fix zoomableViewRef.current is null
      // zoomableViewRef.current?.zoomTo(10);
      // zoomableViewRef.current?.moveTo( res["centerCoordinates"][0] - startX, res["centerCoordinates"][1] - startY);

      setPinPos({ display: 'flex', left: res["centerCoordinates"][0] - startX, top: res["centerCoordinates"][1] - startY });
      setToSearchBar(true);
    });
  }

  return (
    <>
      <SearchLocation selectNode={selectNode} type="from" placeholder="Search for a location" />
      {toSearchBar && <SearchLocation selectNode={selectNode} type="to" placeholder="Search to location" />}

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

        <ImageBackground source={{
          uri: 'https://pathadvisor.ust.hk/api/floors/' + mapImg + '/map-image',
        }} style={[mapSize, styles.border]}>
          <Image style={[styles.pin, pinPos]} source={require('./assets/pin.png')} />

        </ImageBackground>
      </ReactNativeZoomableView>
    </>
  );
};

export default MapView;