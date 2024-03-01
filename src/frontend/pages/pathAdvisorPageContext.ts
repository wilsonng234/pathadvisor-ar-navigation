import { createContext, useContext } from 'react';

import Building from 'backend/schema/building';
import Floor from 'backend/schema/floor';
import Tag from 'backend/schema/tag';

export interface PathAdvisorPageContextType {
    buildings: { [buildingId: string]: Building } | null;
    floors: { [floorId: string]: Floor } | null;
    tags: { [tagId: string]: Tag } | null;
}

export const PathAdvisorPageContext = createContext<PathAdvisorPageContextType | undefined>(undefined);

export const useBuildingsContext = () => {
    const context = useContext(PathAdvisorPageContext);
    if (!context) {
        throw new Error('useBuildingsContext must be used within a PathAdvisorPageContext');
    }
    if (!context.buildings) {
        throw new Error('useBuildingsContext must be used with fetched buildings');
    }

    return context.buildings;
}

export const useFloorsContext = () => {
    const context = useContext(PathAdvisorPageContext);
    if (!context) {
        throw new Error('useFloorsContext must be used within a PathAdvisorPageContext');
    }
    if (!context.floors) {
        throw new Error('useFloorsContext must be used with fetched floors');
    }

    return context.floors;
}

export const useTagsContext = () => {
    const context = useContext(PathAdvisorPageContext);
    if (!context) {
        throw new Error('useTagsContext must be used within a PathAdvisorPageContext');
    }
    if (!context.tags) {
        throw new Error('useTagsContext must be used with fetched tags');
    }

    return context.tags;
}
