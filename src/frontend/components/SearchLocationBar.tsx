import React, { Ref, forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { Keyboard, StyleSheet, View, TouchableWithoutFeedback, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';

import * as api from '../../backend/api';
import Node from '../../backend/schema/node';
import SearchNode from './SearchNode';
import useGetNodesByNodeIds from '../hooks/api/useGetNodesByNodeIds';

import { StorageKeys, storage } from '../utils/storage_utils';

/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @param {function} onClickCancel - function to run when cancel button is clicked
 * @param {string} cacheKey - cache key for search results
 * @returns 
 */
interface SearchLocationBarProps {
    placeholder: string;
    selectNode: (node: Node) => void;
    onClickCancel?: () => void;
    cacheKey: StorageKeys;
}

export type SearchLocationBarRef = {
    setDisplayResults: (displayResults: boolean) => void;
}

const SearchLocationBar = ({ placeholder, selectNode, onClickCancel, cacheKey }: SearchLocationBarProps, ref: Ref<SearchLocationBarRef>) => {
    const [searchText, setSearchText] = useState<string>('');
    const [displayResults, setDisplayResults] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Node[]>([]);
    const [suggestionIds, setSuggestionIds] = useState<string[]>([]);
    useImperativeHandle(ref, () => ({ setDisplayResults }))

    const suggestionQueries = useGetNodesByNodeIds(suggestionIds);
    useEffect(() => {
        if (searchText === '') {
            const allLoaded = suggestionQueries.every((query) => {
                return !query.isLoading;
            });

            if (allLoaded) {
                setSearchResults(suggestionQueries.map((query) => query.data!.data));
            }
        }
    }, [displayResults, JSON.stringify(suggestionQueries)])

    const handleSearchTextChange = (s: string) => {
        setSearchText(s);

        if (s === '') {
            setSearchResults([]);
            return;
        }
        api.getNodesByName(s).then((res) => {
            setSearchResults(res.data)
        });
    }

    const handleSearchTextCancel = () => {
        setSearchText('');
        setDisplayResults(false);
        Keyboard.dismiss();
        onClickCancel && onClickCancel();
    }

    const selectResult = (node: Node) => {
        selectNode(node);
        setDisplayResults(false);
        setSearchText(node.name!);
        Keyboard.dismiss();
    }

    const handleFocusSearchBar = () => {
        setDisplayResults(true);

        if (searchText === '') {
            const suggestions = storage.getString(cacheKey);
            const suggestionArray = suggestions ? JSON.parse(suggestions) : [];

            setSuggestionIds(suggestionArray);
        }
    }

    return (
        <View style={{ position: "relative" }}>
            <SearchBar
                platform="ios"
                searchIcon={{ type: 'material', name: 'search' }}
                clearIcon={{ type: 'material', name: 'clear' }}
                onFocus={handleFocusSearchBar}
                onClear={handleSearchTextCancel}
                cancelButtonTitle=""
                placeholder={placeholder}
                value={searchText} onChange={(e) => handleSearchTextChange(e.nativeEvent.text)}
            />

            {
                displayResults && <View style={styles.dropDownContainer}>
                    <FlatList
                        data={searchResults}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => <SearchNode node={item} selectResult={selectResult} />}
                    />
                </View>
            }
        </View>
    );
}

export default memo(forwardRef<SearchLocationBarRef, SearchLocationBarProps>(SearchLocationBar));

const styles = StyleSheet.create({
    searchResult: {
        padding: 7,
        borderBottomWidth: 1,
        borderColor: "grey"
    },
    searchResultText: {
        color: "black",
        textAlign: "center"
    },
    dropDownContainer: {
        position: "absolute",
        top: 65,
        left: 8,
        zIndex: 1,
        width: "96%",
        maxHeight: 200,
        backgroundColor: "white",
        borderRadius: 15,
    }
})
