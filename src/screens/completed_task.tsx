import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootTabParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
    route: RouteProp<RootTabParamList, 'Completed'>;
}

const CompletedTask: React.FC<Props> = () => {
    return (
        <View>
            <Text>CompletedTask</Text>
        </View>
    )
}

export default CompletedTask

const styles = StyleSheet.create({})