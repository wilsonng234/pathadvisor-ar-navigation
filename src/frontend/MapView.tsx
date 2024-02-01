
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Button, Dimensions, ScrollView, Platform } from 'react-native';
import { SearchBar } from '@rneui/themed';
import * as api from '../backend/';
import { Icon } from '@rneui/base';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  pin: {
    width: width / 50,
    height: width / 20,
    position: 'absolute',
    display: 'none',
  },
  MapView: {
    width: width,
    height: height,
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
      <SearchBar placeholder={props.placeholder} onChange={(e) => searchNodes(e.nativeEvent.text)} value={search} searchIcon=    {<Icon
      color="#0CC"
      containerStyle={{}}
      disabledStyle={{}}
      iconStyle={{}}
      name="devices"
      onLongPress={() => console.log("onLongPress()")}
      onPress={() => console.log("onPress()")}
      size={40}
      type="material"
    />}/>
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
  const [mapSize, setMapSize] = useState({ width: width, height: height, transform: [{ scale: 1 }] });
  const [toSearchBar, setToSearchBar] = useState(false);
  // var fromNode, toNode;
  const [fromNode, setFromNode] = useState({});
  const [toNode, setToNode] = useState({});

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
      setMapSize({ width: res["mapWidth"], height: res["mapHeight"], transform: [{ scale: 1 - width / res["mapWidth"] }] });
      startX = res["startX"];
      startY = res["startY"];
    });
    api.getNodeById(node._id).then((res) => {
      res = res["data"];
      setMapImg(floorId);
      setPinPos({ display: 'flex', left: res["centerCoordinates"][0] - startX, top: res["centerCoordinates"][1] - startY });
      setToSearchBar(true);
    });
  }

  return (
    <View >
      <SearchLocation selectNode={selectNode} type="from" placeholder="Search for a location" />
      {toSearchBar && <SearchLocation selectNode={selectNode} type="to" placeholder="Search to location" />}
      <ScrollView>
        <ScrollView horizontal={true}>
          <View style={styles.MapView}>
            <Image style={[mapSize]}
              source={{
                uri: 'https://pathadvisor.ust.hk/api/floors/' + mapImg + '/map-image',
              }}
            />
            <Image style={[styles.pin, pinPos]} source={require('./assets/pin.png')} />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default MapView;