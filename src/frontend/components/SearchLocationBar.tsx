import React, { useState } from 'react';
import { Text, Keyboard, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';

import * as api from '../../backend/api';
import Node from '../../backend/schema/Node';

interface SearchLocationBarProps {
    placeholder: string;
    selectNode: (node: Node) => void;
    disableToSearchBar?: () => void;
}

/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @returns 
 */
const SearchLocationBar = ({ placeholder, selectNode, disableToSearchBar }: SearchLocationBarProps) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const [searchResults, setSearchResults] = useState<Array<Node>>([]);

    const handleSearchTextChange = (s: string) => {
        setSearchText(s);
        api.getNodesByName(s).then((res) => {
            setSearchResults(
                res.data.map((item: any) => {
                    return {
                        _id: item._id,
                        name: item.name,
                        floorId: item.floorId,
                        centerCoordinates: item.centerCoordinates
                    }
                })
            )
        });
    }

    const handleSearchTextCancel = () => {
        setSearchText('');
        setSearchResults([]);

        disableToSearchBar && disableToSearchBar();
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
                    searchResults.map((item: Node, index: number) => (
                        <TouchableOpacity
                            style={styles.searchResult}
                            key={index}
                            onPress={() => {
                                selectNode(item);
                                setSearchResults([]);
                                setSearchText(item.name!);

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
