import { FloorsDict } from 'frontend/hooks/api/useGetFloors';
import { MMKV } from 'react-native-mmkv'

import * as api from '../../backend/api';
import Floor from '../../backend/schema/floor';

export const storage = new MMKV()

export enum StorageKeys {
    META_VERSION = 'meta',
    BUILDINGS = 'buildings',
    FLOORS = 'floors',
    TAGS = 'tags',
    NODES_BY_FLOOR = 'nodes_by_floor',
    FROM_SUGGESTIONS = 'from.suggestions',
    TO_SUGGESTIONS = 'to.suggestions',
    REACT_QUERY_OFFLINE_CACHE = 'REACT_QUERY_OFFLINE_CACHE'
}
