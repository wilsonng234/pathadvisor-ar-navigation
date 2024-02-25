import React, { createContext, useContext } from 'react';

import Floor from 'backend/schema/floor';
import Tag from 'backend/schema/tag';

export interface PathAdvisorPageContextType {
    floors: { [floorId: string]: Floor } | null;
    tags: { [tagId: string]: Tag } | null;
}

export const PathAdvisorPageContext = createContext<PathAdvisorPageContextType | undefined>(undefined);

export const useFloorsContext = () => {
    const context = useContext(PathAdvisorPageContext);
    if (!context) {
        throw new Error('useFloorsContext must be used within a PathAdvisorPageContext');
    }

    return context.floors;
}

export const useTagsContext = () => {
    const context = useContext(PathAdvisorPageContext);
    if (!context) {
        throw new Error('useTagsContext must be used within a PathAdvisorPageContext');
    }

    return context.tags;
}
