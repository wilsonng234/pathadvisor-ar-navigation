import React, { memo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import Node from '../../backend/schema/node';
import useHomeStore from '../hooks/store/useHomeStore';
import { convertFloorIdToFloorName } from '../utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface RoomDetailsBoxProps {
    node: Node;
    renderButtons: () => JSX.Element;
    onClose: () => void;
}

const RoomDetailsBox = ({ node, renderButtons, onClose }: RoomDetailsBoxProps) => {
    const { buildings, floors } = useHomeStore();

    if (!buildings || !floors)
        return <></>;

    return (
        <View style={styles.roomDetailsBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.roomName}>
                    {node.name}
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={25} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.roomFloor}>
                {buildings[floors[node.floorId].buildingId].name} {floors[node.floorId].name ? `- ${convertFloorIdToFloorName(floors[node.floorId].name!)}` : ""}
            </Text>

            {renderButtons()}
        </View>
    );
}

export default memo(RoomDetailsBox);

const styles = StyleSheet.create({
    roomDetailsBox: {
        flex: 1,
        backgroundColor: "#003366",
        borderRadius: 20,
        padding: 20,
        rowGap: 15,
    },

    roomName: {
        color: "white",
        fontSize: 20,
    },

    roomFloor: {
        color: "white",
        fontSize: 16,
    }
});
