import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export enum StorageKeys {
    FromSuggestions = 'from.suggestions',
    ToSuggestions = 'to.suggestions',
}
