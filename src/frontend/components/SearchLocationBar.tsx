import React, { useState } from 'react';
import { Text, Keyboard, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';

import * as api from '../../backend/';

interface SearchLocationBarProps {
    placeholder: string;
    selectNode: (node: any) => void;
}

interface SearchResult {
    name: string;
    floorId: string;
}

/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @returns 
 */
const SearchLocationBar = ({ placeholder, selectNode }: SearchLocationBarProps) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

    const handleSearchTextChange = (s: string) => {
        setSearchText(s);
        api.getNodesByName(s).then((res) => {
            setSearchResults(
                res.data.map((item: any) => {
                    return {
                        name: item.name,
                        floorId: item.floorId,
                    }
                })
            )
        });
    }

    const handleSearchTextCancel = () => {
        setSearchText('');
        setSearchResults([]);
    }

    return (
        <>
            <SearchBar
                platform="ios"
                searchIcon={{ type: 'material', name: 'search' }}
                clearIcon={{ type: 'material', name: 'clear' }}
                placeholder={placeholder}
                value={searchText} onChange={(e) => handleSearchTextChange(e.nativeEvent.text)}
                showCancel={true} onCancel={handleSearchTextCancel} />

            <>
                {
                    // display search results dropdown
                    searchResults.map((item: any) => (
                        <TouchableOpacity
                            style={styles.searchResult}
                            onPress={() => {
                                selectNode(item);
                                setSearchResults([]);
                                setSearchText(item.name);

                                Keyboard.dismiss();
                            }}>
                            <Text style={styles.searchResultText}>{`${item.name} (${item.floorId})`}</Text>
                        </TouchableOpacity>
                    ))
                }
            </>
        </>
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
    }
})
