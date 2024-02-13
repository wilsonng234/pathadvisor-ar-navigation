
import React, { createRef, useState, useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, Button, Dimensions, ImageBackground, ImageStyle, Text, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { SearchBar } from '@rneui/themed';
import * as api from '../backend/';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Svg, { Polyline, Rect } from 'react-native-svg';

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
  const onCancel = () => {
    setSearch('');
    setData([]);
  }


  return (
    <>
      <SearchBar platform="ios" searchIcon={{ type: 'material', name: 'search' }} clearIcon={{ type: 'material', name: 'clear' }} containerStyle={styles.searchBar} placeholder={placeholder} onChange={(e) => searchNodes(e.nativeEvent.text)} value={search} showCancel={true} onCancel={onCancel} />
      <View>
        {
          //show search results
          data && data?.map((item: any, index: number) => (
            <TouchableOpacity
              style={{ padding: 7, borderBottomWidth: 1, borderColor: "grey" }}
              key={index}
              onPress={() => {
                Keyboard.dismiss();
                selectNode(item);
                setData([]);
                setSearch(item.name);
              }}>
              <Text style={{ color: "black", textAlign: "center" }}>{`${item.name} (${item.floorId})`}</Text>
            </TouchableOpacity>
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
  const [path, setPath] = useState<any>(null);
  const floorViewRef = useRef<any>();
  const [floors, setFloors] = useState<any>([]);
  // function to select "from" node
  const selectFromNode = (node: any) => {
    floorViewRef.current?.setFloor(node.floorId);

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
        path[res.floorId].push([res.coordinates[0] - floors[res.floorId].startX, res.coordinates[1] - floors[res.floorId].startY]);
      });
      setPath(path);
    });
  }
  useEffect(() => {
    api.getAllFloors().then((res) => {
      res = res["data"];
      let result = {};
      res.map((floor: any) => {
        result[floor._id] = floor;
      });
      setFloors(result);
    });
  }, []);
  return (
    <>
      <SearchLocation selectNode={selectFromNode} placeholder="Search for a location" />
      {enableToSearchBar && <SearchLocation selectNode={selectToNode} placeholder="Search to location" />}
      {//temp view for debug
      /* <ScrollView horizontal={true} style={{ maxHeight: 40 }}>
        {floors && Object.keys(floors).map((floor) => (
          <Button title={floor} key={floor} onPress={() => floorViewRef.current.setFloor(floor)} />
        ))}
      </ScrollView > */}
      <FloorView ref={floorViewRef} node={fromNode} path={path} />
    </>
  );
};

/**
 * FloorView component only show the map|pin|path...
 * @param {string} floor floor id
 * @param node node of (from|to) for show the pin or zoom
 * @param zoomToPin zoom to the pin or not
 * @param {Map} path path to draw ({"floorId":[[x,x],[x,x]...,[x,x]],..})
 */
const FloorView = forwardRef(({ node, zoomToPin = false, path }: { node?: any, zoomToPin?: boolean, path: object }, ref) => {
  const zoomableViewRef = createRef<ReactNativeZoomableView>();

  const [mapSize, setMapSize] = useState({ height: 0, width: 0 });
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const [floor, setFloor] = useState("G");
  const [nodes, setNodes] = useState([]);
  const [tags, setTags] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const iconSize = 0.012;


  useEffect(() => {
    api.getAllTags().then((res) => {
      res = res["data"];
      setTags(res);
    });
  }, []);


  useEffect(() => {
    if (ref && 'current' in ref) {
      ref.current = {
        setFloor: setFloor
      }
    }
    let startX = 0, startY = 0;
    api.getFloorById(floor).then((res) => {
      res = res["data"];
      startX = res.startX;
      startY = res.startY;
      setMapSize({ height: res.mapHeight, width: res.mapWidth });
      let boxCoordinates = (startX) + "," + (startY) + "," + (startX + res.mapWidth) + "," + (startY + res.mapHeight);

      api.getNodesWithinBoundingBox(floor, boxCoordinates).then((res) => {
        res = res["data"];
        res.map((node: any) => {
          node["position"] = [node["centerCoordinates"][0] - startX, node["centerCoordinates"][1] - startY];
        });
        setNodes(res);
      });
    });


    node && api.getNodeById(node._id).then((res) => {
      setShowPin(node.floorId === floor);
      res = res["data"];
      setNodePosition({ x: res["centerCoordinates"][0] - startX, y: res["centerCoordinates"][1] - startY });
    });

  }, [floor, node, path]);



  const changeFloor = () => {
  }

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
        style={{ height: mapSize.height, width: mapSize.width, justifyContent: 'center',alignItems:'center' }}>
        <Image
          style={[styles.pin, { display: showPin ? 'flex' : 'none', left: nodePosition.x, top: nodePosition.y }]}
          source={require('./assets/pin.png')} />

        {/* if width&height match map size the app will crash. So scale it*/}
        <View style={[{
          width: mapSize.width / 10,
          height: mapSize.height / 10,
          transform: [{ scale: 10 }],
          borderColor:'black',borderWidth:1
        }]}>

          <Svg viewBox={`0 0 ${mapSize.width} ${mapSize.height}`} height="100%" width="100%" >
            {path && path[floor] &&
              <Polyline points={path[floor]} stroke="red" strokeWidth="10" fill="none" />
            }
          </Svg>
        </View>
        {
          (tags.length > 0) && nodes && nodes.map((node: any, index: number) => {

            let tag = node["tagIds"] ? tags.find((tag: any) => tag._id === node["tagIds"][0]) : null;
            return (
              <TouchableOpacity
                onPress={changeFloor}
                key={node._id}
                style={{
                  position: 'absolute',
                  left: node["position"][0],
                  top: node["position"][1],
                }}>
                {(tag && tag["imageUrl"]) ? (
                  <Image
                    style={{
                      width: mapSize.width / (1 / iconSize),
                      height: mapSize.width / (1 / iconSize)
                    }}
                    source={{ uri: tag["imageUrl"] }}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: mapSize.width / (1 / (iconSize * 0.25)),
                      color: 'black',
                      left: -mapSize.width / (1 / (iconSize * 0.5)),
                      top: -mapSize.width / (1 / (iconSize * 0.5)),
                    }}>
                    {node.name}
                  </Text>
                )}
              </TouchableOpacity>);
          })
        }


      </ImageBackground>

    </ReactNativeZoomableView>

  )
});

// FloorView.propTypes = {
//   node: PropTypes.object.isRequired,
//   zoomToPin: PropTypes.bool.isRequired,
//   path: PropTypes.object.isRequired
// };


export default MapView;
export { FloorView };