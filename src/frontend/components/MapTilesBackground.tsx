import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useFloorsContext } from '../pages/pathAdvisorPageContext';
import { getMapTileStartCoordinates, getMapTilesNumber } from '../utils';

export const MAP_TILE_WIDTH = 200;
export const MAP_TILE_HEIGHT = 200;

interface MapTileBlock {
    floorId: string;
    x: number;
    y: number;
    zoomLevel: number;
}

interface MapTilesBackgroundProps {
    floorId: string;
    children?: React.ReactNode;
}

const MapTilesBackground = ({ floorId, children }: MapTilesBackgroundProps) => {
    const floors = useFloorsContext();

    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors[floorId]);
    const { numRow, numCol } = getMapTilesNumber(floors[floorId]);
    const zoomLevel = 0;

    const mapTileBlocks = new Array<Array<MapTileBlock>>(numRow);
    for (let i = 0; i < numRow; i++) {
        mapTileBlocks[i] = new Array<MapTileBlock>(numCol);

        for (let j = 0; j < numCol; j++) {
            mapTileBlocks[i][j] = {
                floorId: floorId,
                x: j * MAP_TILE_WIDTH + tileStartX,
                y: i * MAP_TILE_HEIGHT + tileStartY,
                zoomLevel: zoomLevel
            }
        }
    }

    return (
        <View>
            {mapTileBlocks.map((row, i) => {
                return (
                    <View key={i} style={styles.mapTilesRow}>
                        {
                            row.map((mapTileBlock, j) => {
                                return (
                                    <Image
                                        key={`${i}-${j}`}
                                        style={{ width: MAP_TILE_WIDTH, height: MAP_TILE_HEIGHT }}
                                        source={{ uri: `https://pathadvisor.ust.hk/api/floors/${mapTileBlock.floorId}/map-tiles?x=${mapTileBlock.x}&y=${mapTileBlock.y}&zoomLevel=${mapTileBlock.zoomLevel}` }}
                                    />
                                )
                            })
                        }
                    </View>
                )
            })}

            {children}
        </View>
    )
}

export default MapTilesBackground;

const styles = StyleSheet.create({
    mapTilesRow: {
        flexDirection: 'row',
    },
})
