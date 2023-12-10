// App.js
import React, { Component} from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { View } from 'react-native-animatable';

export default function VideoCall(props) {
    const userID = props.route.params.info.userId;
    const userName = props.route.params.info.username;
    const callID = props.route.params.info.callId;
    const AppId = "300883860"
    const AppSign = "26eb9a7e672adc71b7446345f03f8e64d2972403524158a61db25ffd38a2dff1"
    console.log("props",props.route.params)
    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={AppId}
                appSign={AppSign}
                userID={userID} // userID can be something like a phone number or the user id on your own user system. 
                userName={userName}
                callID={callID} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { props.navigation.navigate('Home') },
                    onHangUp: () => { props.navigation.navigate('Home') },
                }}
            />
        </View>
    );
}