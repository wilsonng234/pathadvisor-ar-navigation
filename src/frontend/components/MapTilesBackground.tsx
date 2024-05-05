import React, { memo, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, View } from 'react-native';

import useGetMapTilesByFloorId from '../hooks/api/useGetMapTilesByFloorId';
import useHomeStore from '../hooks/store/useHomeStore';
import { getFloorMapTileBlocks } from '../utils/mapTiles_utils';
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
            setMapTileBlocks(getFloorMapTileBlocks(floors, floorId));
        }
    }, [floors, floorId])

    if (!floors || !mapTiles)
        return <></>;
    else
        return (
            <View>
                {mapTileBlocks.map((row: MapTileBlock[], i: number) => {
                    return (
                        <View key={i} style={styles.mapTilesRow}>
                            {
                                row.map((mapTileBlock: MapTileBlock, j: number) => {
                                    const imageUri = downloaded ?
                                        "data:image/png;base64," + mapTiles[`${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`] :
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

export default memo(MapTilesBackground);

const styles = StyleSheet.create({
    mapTilesRow: {
        flexDirection: 'row',
    },
})
