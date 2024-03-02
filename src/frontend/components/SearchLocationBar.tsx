import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';

import * as api from '../../backend/api';
import Node from '../../backend/schema/Node';
import SearchNode from './SearchNode';

interface SearchLocationBarProps {
    placeholder: string;
    selectNode: (node: Node) => void;
    onClickCancel?: () => void;
}

/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @param {function} onClickCancel - function to run when cancel button is clicked
 * @returns 
 */
const SearchLocationBar = ({ placeholder, selectNode, onClickCancel }: SearchLocationBarProps) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const [searchResults, setSearchResults] = useState<Array<Node>>([]);

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
        setSearchResults([]);

        onClickCancel && onClickCancel();
    }

    const selectResult = (node: Node) => {
        selectNode(node);
        setSearchResults([]);
        setSearchText(node.name!);

        Keyboard.dismiss();
    }

    return (
        <View style={{ position: "relative" }}>
            <SearchBar
                platform="ios"
                searchIcon={{ type: 'material', name: 'search' }}
                clearIcon={{ type: 'material', name: 'clear' }}
                onClear={handleSearchTextCancel}
                cancelButtonTitle=""
                placeholder={placeholder}
                value={searchText} onChange={(e) => handleSearchTextChange(e.nativeEvent.text)}
            />
            <View style={styles.dropDownContainer}>
                <FlatList
                    data={searchResults}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => <SearchNode node={item} selectResult={selectResult} />}
                />
            </View>
        </View>
    );
}

export default SearchLocationBar

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
        top: 60,
        left: 8,
        zIndex: 1,
        elevation: (Platform.OS === 'android') ? 1 : 0,
        width: "80%",
        maxHeight: 200,
        backgroundColor: "white",
        borderBottomLeftRadius: 15,
        borderBottomEndRadius: 15,
    }
})
