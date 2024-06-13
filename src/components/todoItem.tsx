import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface TodoItemProps {
    id: string;
    title: string;
    description: string;
    date: string;
    isDone: boolean;
    time: string,
    onToggle: (id: string, currentStatus: boolean) => void;
    onDismiss: (id: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;


const TodoItem: React.FC<TodoItemProps> = ({ id, title, description, date, time, isDone, onToggle, onDismiss }) => {


    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(70);
    const marginVertical = useSharedValue(10);
    const opacity = useSharedValue(1);

    const panGesture = useAnimatedGestureHandler({
        onActive: (event) => {
            translateX.value = event.translationX;
        },
        onEnd: () => {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;

            if (shouldBeDismissed) {
                translateX.value = withTiming(-SCREEN_WIDTH);
                itemHeight.value = withTiming(0);
                marginVertical.value = withTiming(0);
                // opacity.value = withTiming(0);
                opacity.value = withTiming(0, undefined, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onDismiss)(id);
                    }
                })
            }
            else {
                translateX.value = withTiming(0);
            }
        },
    });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const rIconContainerStyle = useAnimatedStyle(() => {

        const opacity = withTiming(
            translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
        );
        return { opacity };
    });

    const rTaskContainerStyle = useAnimatedStyle(() => {
        return {
            height: itemHeight.value,
            marginVertical: marginVertical.value,
            opacity: opacity.value,
        }
    })

    return (

        <GestureHandlerRootView >
            <Animated.View style={[rTaskContainerStyle, styles.container]}>
                <Animated.View style={[styles.iconContainer, styles.deleteContainer, rIconContainerStyle]}>
                    <Icon name='delete' size={25} style={styles.deleteIconStyle} color='red' />
                </Animated.View>
                <PanGestureHandler onGestureEvent={panGesture}>
                    <Animated.View style={[styles.list, rStyle, isDone == true ? styles.completionStyle : styles.empty]}>

                        <Text style={[styles.dateStyle,]}>{time}</Text>
                        <View style={[styles.todo,]}>
                            <Text style={[styles.listTitle, isDone == true ? styles.completionStyle : styles.empty]}> {title}</Text>
                            <Text style={[styles.listDesc, isDone == true ? styles.completionStyle : styles.empty]}> {description}</Text>
                        </View>
                        <BouncyCheckbox
                            isChecked={isDone}
                            onPress={() => onToggle(id, isDone)}
                            fillColor='#29AB87'
                        />

                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </GestureHandlerRootView>
    );
};

export default TodoItem

const styles = StyleSheet.create({
    container: {
        // margin: 10
    },
    completionStyle: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    empty: {},
    listContainer: {
        paddingVertical: 20
    },
    todo: {
        height: 70,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingLeft: 15
    },
    dateStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 30,
        fontWeight: '600'
    },
    list: {
        flexDirection: 'row',
        paddingBottom: 5,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        elevation: 3,
        shadowOpacity: 1,
        shadowOffset: {
            width: 10,
            height: 20,
        },
        shadowRadius: 10
    },
    listTitle: {
        fontSize: 15,
        fontWeight: '600'
    },
    listDesc: {
        fontSize: 15,
        fontWeight: '400'
    },
    deleteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffcbd1',
        width: 50,
        height: 50,
        margin: 10,
        borderRadius: 25
    },
    deleteIconStyle: {
        padding: 10,
        // paddingRight: 20
    },
    iconContainer: {
        height: 70,
        width: 70,
        position: 'absolute',
        right: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})