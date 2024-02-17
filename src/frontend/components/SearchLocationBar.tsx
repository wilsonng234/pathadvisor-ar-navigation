import React, { useState } from 'react';
import { View, Text, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';

import * as api from '../../backend/';


interface SearchLocationBarProps {
    placeholder: string;
    selectNode: (node: any) => void;
}

/**
 * Component contains search bar and list of search results
 * @param {string} placeholder - placeholder for search bar
 * @param {function} selectNode - function to run when a node is selected
 * @returns 
 */
const SearchLocationBar = ({ placeholder, selectNode }: SearchLocationBarProps) => {
    const [searchText, setSearchText] = React.useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchTextChange = (s: string) => {
        setSearchText(s);
        api.getNodesByName(s).then((res) => {
            setSearchResults(res.data);
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

            <View>
                {
                    // display search results dropdown
                    searchResults.map((item: any, index: number) => (
                        <TouchableOpacity
                            style={{ padding: 7, borderBottomWidth: 1, borderColor: "grey" }}
                            key={index}
                            onPress={() => {
                                Keyboard.dismiss();
                                selectNode(item);
                                setSearchResults([]);
                                setSearchText(item.name);
                            }}>
                            <Text style={{ color: "black", textAlign: "center" }}>{`${item.name} (${item.floorId})`}</Text>
                        </TouchableOpacity>
                    ))}
            </View>
        </>
    );
}

export default SearchLocationBar
