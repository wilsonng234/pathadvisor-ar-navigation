import { create } from 'zustand'

import { BuildingsDict, FloorsDict, TagsDict } from '../../utils/storage_utils';

const useHomeStore = create((set) => ({
    buildings: undefined,
    setBuildings: (buildings: BuildingsDict) => set({ buildings }),
    floors: undefined,
    setFloors: (floors: FloorsDict) => set({ floors }),
    tags: undefined,
    setTags: (tags: TagsDict) => set({ tags }),
}))

export default useHomeStore;
