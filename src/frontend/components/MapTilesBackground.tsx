import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, View } from 'react-native';

import LoadingScreen from './LoadingScreen';
import useGetMapTilesByFloorId from '../hooks/api/useGetMapTilesByFloorId';
import useHomeStore from '../hooks/store/useHomeStore';
import { getMapTileStartCoordinates, getMapTilesNumber } from '../utils';
import { MapTileBlock } from '../utils/storage_utils';

export const LOGIC_MAP_TILE_WIDTH = 200;
export const LOGIC_MAP_TILE_HEIGHT = 200;
export const RENDER_MAP_TILE_WIDTH = 80;
export const RENDER_MAP_TILE_HEIGHT = 80;

interface MapTilesBackgroundProps {
    floorId: string;
    children?: React.ReactNode;
}

const MapTilesBackground = ({ floorId, children }: MapTilesBackgroundProps) => {
    const { floors } = useHomeStore();
    const { data: mapTiles, isLoading: isLoadingMapTiles, downloaded } = useGetMapTilesByFloorId(floorId);
    const [mapTileBlocks, setMapTileBlocks] = useState<MapTileBlock[][]>([]);

    useEffect(() => {
        if (floors) {
            const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors[floorId]);
            const { numRow, numCol } = getMapTilesNumber(floors[floorId]);

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

            setMapTileBlocks(mapTileBlocks);
        }
    }, [floors, floorId])

    if (isLoadingMapTiles)
        return <LoadingScreen />
    else
        return (
            <View>
                {mapTileBlocks.map((row, i) => {
                    return (
                        <View key={i} style={styles.mapTilesRow}>
                            {
                                row.map((mapTileBlock, j) => {
                                    const imageUri = downloaded ?
                                        "data:image/png;base64," + mapTiles![`${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`] :
                                        `https://pathadvisor.ust.hk/api/floors/${mapTileBlock.floorId}/map-tiles?x=${mapTileBlock.x}&y=${mapTileBlock.y}&zoomLevel=${mapTileBlock.zoomLevel}`;

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
