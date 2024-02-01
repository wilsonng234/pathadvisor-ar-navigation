
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Button, Dimensions, ScrollView, Platform } from 'react-native';
import { SearchBar } from '@rneui/themed';
import * as api from '../backend/';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  pin: {
    width: width/50,
    height: width/20,
    position: 'absolute',
    display: 'none',
  },
  map:{
    width: 4992,
    height: 3532,
  }
});

//show search results
const SearchResults = (props: any) => {
  if (props["data"] == null) {
    return null;
  }
  let data = props["data"]["data"];

  return (
    <View>
      {
        data.map((item: any, index: number) => (
          <Button key={index} title={item.name} onPress={() => props.selectNode(item)} />
        ))
      }
    </View>
  );
}

const MapView = () => {
  const [search, setSearch] = React.useState('');
  const [data, setData] = useState(null);
  const [mapImg, setMapImg] = useState("G");
  const [pinPos, setPinPos] = useState({ display: 'none', left: 0, top: 0 });
  const [mapSize, setMapSize] = useState({ width: width, height: height});
  

  const searchNodes = (s: string) => {
    setSearch(s);
    api.getNodesByName(s).then((res) => {
      setData(res);
    });
  }
  const selectNode = (node: any) => {
    setSearch(node.name);
    setData(null);
    let floorId = node.floorId;
    let startX = 0;
    let startY = 0;
    api.getFloor(floorId).then((res) => {
      res = res["data"];
      setMapSize({ width: res["mapWidth"], height: res["mapHeight"]});
      startX = res["startX"];
      startY = res["startY"];
    });
    api.getNodeById(node._id).then((res) => {
      res = res["data"];
      setMapImg(floorId);
      setPinPos({ display: 'flex', left: res["centerCoordinates"][0]-startX, top: res["centerCoordinates"][1] -startY});
    });

  }

  return (
    <View>
      <SearchBar placeholder='Search for a location' onChange={(e) => searchNodes(e.nativeEvent.text)} value={search} />
      <SearchResults data={data} selectNode={selectNode} />
      <ScrollView>
        <ScrollView horizontal={true}>

          <Image
            style={[styles.map, mapSize]}
            source={{
              uri: 'https://pathadvisor.ust.hk/api/floors/' + mapImg + '/map-image',
            }}
          />
          <Image style={[styles.pin, pinPos]} source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAA2CAYAAADd0Vm+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDEvMDkvMTIyt/MzAAACeklEQVRYhe2YsW/TQBTGf+dmgGSplIWBqGYAlc1sAQmJsQtqFhBbwsjUrkiMCDZWxoQNdSr/QSUkykY3UCsVSwWpC0onByTQY7CN7fOdc4nDECmf9JZ3z993d+/uPduICFYDX2BX4EBgLCCJjRPfroBfxVFFPMoRTrORTchEPtBm62pjgUG1QEw+K7FuA7NAFXkTkQCR+4kFic9BRIkIKOUDn4B18mgCD4HbmHEI7AFRaeQCuIVImAoMgUEhpAM8AdoW8hQR8Ao4K42MEHmsBHzga2nmzyzkEXCcI+wk9ty4kmsNYLvkfmAgj4i349CykrZRYLsB9Eqzv6OFnQGvgR8WcqxjPQ8ICq7rWkjkQG5H4KGfnI4Wsjc3OcC6VzkcYd9zR3jEZzZD/rgd1yMHLjzgqODKk5bP9qw48oD9gmsCfKhNnGK/LADZ9dcTPodAWuiGpYJ1FZEXtarqMKumsGHsAZcRac9FPhbY0Mt1fwG9ILW+reEsQqRv72iZyLwts6/zlQWynJQTX5XQZM/dBIpCO6ctZLKWEU7WkNMWIrBjIy62zCl4eVMZg55+FjXt2YbLbWn9cYmqI/B76QVWWzRV4H9vUXPpV1AnB06lQpS5VChZUKmYylKB6hevBWAlsBJYAgHrRVNKXQI2if9b2GJ6QAh8EZGfTgIJ8T2g6zDBIDGUUh+BA12oIKCUugI8Qv9uc0MX2FRKvRWR89Sp52DLRP4dzl18ybNbeYcu4FumNjqJ9xqAEwi7MDLF6hx6DkKTyDf4dQPevE/+CtyFdxbylOMfCv2gZg4g/mIt5KDUcGY8RXkYT5G1o+XvAfGKfC0kTGYcUnEP/gK5oBMMPY+dsAAAAABJRU5ErkJggg==' }} />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default MapView;