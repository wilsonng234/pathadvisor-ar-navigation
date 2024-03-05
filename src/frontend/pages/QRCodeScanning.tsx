'use strict';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const QRCodeScanning = (props) => {
    const [data, setData] = useState('' as string);


    const onSuccess = (e) => {
        try {
            const jsonProp = ["x", "y", "floor", "building", "orientation", "id", "name"]
            const jsonData = JSON.parse(e.data);



            if (jsonProp.some((prop)=>{
                return !Object.keys(jsonData).includes(prop)
            })) {
                throw new Error("Invalid QR Code");
            }
            props.setQRCodeData(jsonData)
        }
        catch {
            setData("Error: Invalid QR Code")
        }
    }


    return (<>
        <QRCodeScanner
            reactivate={true}
            reactivateTimeout={1000}
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.auto}
            topContent={
                <Text style={styles.centerText}>
                    {data}
                </Text>
            }
            bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                    <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
            }
        />
    </>)
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

export default QRCodeScanning;