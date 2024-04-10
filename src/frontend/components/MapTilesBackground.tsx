import React from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, Text, View } from 'react-native';
import { UseQueryResult } from '@tanstack/react-query';

import { getMapTileStartCoordinates, getMapTilesNumber } from '../utils';
import { FloorsDict, useFloorsQuery } from '../utils/reactQueryFactory';
import LoadingScreen from './LoadingScreen';

export const LOGIC_MAP_TILE_WIDTH = 200;
export const LOGIC_MAP_TILE_HEIGHT = 200;
export const RENDER_MAP_TILE_WIDTH = 80;
export const RENDER_MAP_TILE_HEIGHT = 80;

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
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery();
    const mapTileDict = require('../assets/mapTileImg/mapTileDict.json');

    if (isLoadingFloors) {
        return <LoadingScreen />;
    }

    // floors are guaranteed to be loaded at this point
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![floorId]);
    const { numRow, numCol } = getMapTilesNumber(floors![floorId]);

    const mapTileBlocks = new Array<Array<MapTileBlock>>(numRow);
    for (let i = 0; i < numRow; i++) {
        mapTileBlocks[i] = new Array<MapTileBlock>(numCol);

        for (let j = 0; j < numCol; j++) {
            mapTileBlocks[i][j] = {
                floorId: floorId,
                x: j * LOGIC_MAP_TILE_WIDTH + tileStartX,
                y: i * LOGIC_MAP_TILE_HEIGHT + tileStartY,
                zoomLevel: 0
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
                                let key = `${mapTileBlock.floorId}_${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`;
                                let imageUri = "data:image/png;base64," + `${mapTileDict[key]}`;
                                return (
                                    <FastImage
                                        key={`${i}-${j}`}
                                        style={{ width: RENDER_MAP_TILE_WIDTH, height: RENDER_MAP_TILE_HEIGHT }}
                                        source={{ uri: imageUri }}
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
