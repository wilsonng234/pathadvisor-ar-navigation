import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';

const circleDiameter = Dimensions.get('window').width;

const ARBottomNavigationBar = () => {
    return (
        <View style={styles.circle}>
            <Image
                style={styles.dummy}
                source={require('../../assets/ar/dummy.png')}
            />
        </View>
    )
}

export default ARBottomNavigationBar;

var styles = StyleSheet.create({
    circle: {
        height: circleDiameter / 2 * 1.4,
        width: circleDiameter * 1.2,
        borderTopLeftRadius: (circleDiameter / 2) * 1.2,
        borderTopRightRadius: (circleDiameter / 2) * 1.2,
        zIndex: 999,
        elevation: (Platform.OS === 'android') ? 50 : 0,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexDirection: 'column-reverse',
    },
    dummy: {
        width: '99%',
        height: '99%',
        overflow: 'hidden',
    }
})
