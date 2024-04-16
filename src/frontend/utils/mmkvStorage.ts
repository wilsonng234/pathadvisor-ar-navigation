import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export enum StorageKeys {
    META = 'meta',
    FROM_SUGGESTIONS = 'from.suggestions',
    TO_SUGGESTIONS = 'to.suggestions',
}
