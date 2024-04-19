import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image'
import { Buffer } from "buffer";
import { StyleSheet, View } from 'react-native';


import LoadingScreen from './LoadingScreen';
import useGetFloors from '../../frontend/hooks/api/useGetFloors';
import { getMapTileStartCoordinates, getMapTilesNumber } from '../utils';
import { storage } from '../../frontend/utils/mmkvStorage';
import { getMapTiles } from '../../backend/api/image/getMapTiles';

export const LOGIC_MAP_TILE_WIDTH = 200;
export const LOGIC_MAP_TILE_HEIGHT = 200;
export const RENDER_MAP_TILE_WIDTH = 80;
export const RENDER_MAP_TILE_HEIGHT = 80;

export interface MapTileBlock {
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
    const { data: floors, isLoading: isLoadingFloors } = useGetFloors();
    const [mapTileBlocks, setMapTileBlocks] = useState<MapTileBlock[][]>([]);
    const [downloaded, setDownloaded] = useState<boolean>(false);

    useEffect(() => {
        const downloadMapTile = async (mapTileBlocks: MapTileBlock[][]) => {
            const promises = mapTileBlocks.map((row) => {
                return row.map(async (mapTileBlock) => {

                    const key = `mapTile_${mapTileBlock.floorId}_${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`;
                    const maptile = await getMapTiles(floorId, mapTileBlock.x, mapTileBlock.y, 0);

                    if (!storage.contains(key)) {
                        const base64 = Buffer.from(maptile, 'binary').toString('base64');
                        storage.set(key, base64);
                    }
                })
            })

            await Promise.all(promises.flat());
            setDownloaded(true);
        }

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

            downloadMapTile(mapTileBlocks);
            setMapTileBlocks(mapTileBlocks);
        }
    }, [floors, floorId])


    if (isLoadingFloors || !downloaded) {
        return <LoadingScreen />;
    }

    // floors are guaranteed to be loaded at this point
    return (
        <View>
            {mapTileBlocks.map((row, i) => {
                return (
                    <View key={i} style={styles.mapTilesRow}>
                        {
                            row.map((mapTileBlock, j) => {
                                const key = `mapTile_${mapTileBlock.floorId}_${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`;
                                const imageUri = "data:image/png;base64," + storage.getString(key);

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
