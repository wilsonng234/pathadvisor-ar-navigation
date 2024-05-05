import { create } from 'zustand'

import { BuildingsDict, FloorsDict, MapTilesByFloorDict, TagsDict } from '../../utils/storage_utils';

interface HomeState {
    buildings: BuildingsDict | undefined,
    setBuildings: (buildings: BuildingsDict) => void,
    floors: FloorsDict | undefined,
    setFloors: (floors: FloorsDict) => void,
    tags: TagsDict | undefined,
    setTags: (tags: TagsDict) => void,
    mapTiles: MapTilesByFloorDict | undefined,
    setMapTiles: (mapTiles: MapTilesByFloorDict) => void,
}

const useHomeStore = create<HomeState>((set) => ({
    buildings: undefined,
    setBuildings: (buildings: BuildingsDict) => set({ buildings }),
    floors: undefined,
    setFloors: (floors: FloorsDict) => set({ floors }),
    tags: undefined,
    setTags: (tags: TagsDict) => set({ tags }),
    mapTiles: undefined,
    setMapTiles: (mapTiles: MapTilesByFloorDict) => set({ mapTiles }),
}))

export default useHomeStore;
