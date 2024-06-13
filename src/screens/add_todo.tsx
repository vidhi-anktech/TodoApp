import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ClockIcon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
    route: RouteProp<RootStackParamList, 'Add'>;

};

const AddToDo = ({ navigation }: Props) => {
    const initialDate = new Date();
    const initialDateText = initialDate.toISOString().slice(0, 10);

    const [date, setDate] = useState<Date>(initialDate);
    const [dateText, setDateText] = useState<string>(initialDateText);
    const [time, setTime] = useState<Date>(initialDate);
    const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
    const [titleText, onChangeTitleText] = useState<string>('');
    const [descText, onChangeDescText] = useState<string>('');
    const [titleError, setTitleError] = useState<string | null>(null);

    const handleDateChange = (text: string) => {
        setDateText(text);
        const parsedDate = new Date(text);
        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTime = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const addButton = () => {

        if (titleText.trim() === '') {
            setTitleError('Title is required');
            return;
        } else {
            setTitleError(null);
        }

        console.log('Button pressed');
        console.log(dateText);
        console.log(titleText);
        console.log(descText);
        // const combinedDateTime = new Date(`${dateText}T${formatTime(time)}:00`);
        const timeText = formatTime(time);
        firestore()
            .collection('Todos')
            .add({
                title: titleText,
                date: dateText,
                desc: descText,
                isDone: false,
                time: timeText
            })
            .then(() => {
                console.log('Todo Created');
                setDate(initialDate);
                setDateText(initialDateText);
                setTime(initialDate);
                onChangeTitleText('');
                onChangeDescText('');
                navigation.pop();
            });
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Image source={require('../assets/image4.png')} style={styles.addImage} />
                        <Text style={styles.header}>Add Task</Text>
                        <View style={[styles.form]}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={[styles.input, titleError ? styles.inputError : null]}
                                cursorColor='#0047AB'
                                value={titleText}
                                onChangeText={onChangeTitleText}
                                onFocus={() => setShowPicker(null)}
                            />
                            {titleError && <Text style={styles.errorText}>{titleError}</Text>}

                            <Text style={styles.label}>Date</Text>
                            <View style={styles.dateContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    value={dateText}
                                    onChangeText={handleDateChange}
                                    placeholder="YYYY-MM-DD"
                                    keyboardType="numeric"
                                    cursorColor='#0047AB'
                                    onFocus={() => setShowPicker('date')}
                                />
                                <View style={styles.dateBtn}>
                                    <TouchableOpacity onPress={() => setShowPicker('date')}>
                                        <Icon name='calendar' size={22} style={styles.calendarIcon} color='#0047AB' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.label}>Time</Text>
                            <View style={styles.dateContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    value={formatTime(time)}
                                    onFocus={() => setShowPicker('time')} // Show time picker on focus
                                    placeholder="HH:MM"
                                    keyboardType="numeric"
                                    cursorColor='#0047AB'
                                />
                                <View style={styles.dateBtn}>
                                    <TouchableOpacity onPress={() => setShowPicker('time')}>
                                        <ClockIcon name='clockcircle' size={22} style={styles.calendarIcon} color='#0047AB' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.label}>Add Description</Text>
                            <TextInput
                                style={styles.input1}
                                cursorColor='#0047AB'
                                multiline
                                numberOfLines={3}
                                maxLength={40}
                                value={descText}
                                onChangeText={onChangeDescText}
                            />
                        </View>

                        <TouchableOpacity style={styles.addBtn} onPress={addButton}>
                            <Text style={styles.addBtnTxt}>Add Note</Text>
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={showPicker === 'date' ? date : time}
                                mode={showPicker}
                                is24Hour={true}
                                display="default"
                                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                    setShowPicker(null);
                                    if (selectedDate) {
                                        if (showPicker === 'date') {
                                            setDate(selectedDate);
                                            setDateText(formatDate(selectedDate));
                                        } else if (showPicker === 'time') {
                                            setTime(selectedDate);
                                        }
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#A7C7E7'
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    addImage: {
        height: 170,
        width: 220,
        top: -100,
    },
    card: {
        backgroundColor: 'white',
        borderTopLeftRadius: 80,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
        width: 370,
        height: 650,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    header: {
        fontSize: 30,
        fontWeight: '600',
        color: '#000',
        top: -90,
        marginBottom: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 20
    },
    form: {
        top: -80,
        marginBottom: 16,
        width: '100%'
    },
    label: {
        marginBottom: 0,
        fontSize: 12,
        fontWeight: '400',
        color: '#606060',
        marginHorizontal: 15,
    },
    input: {
        marginBottom: 8,
        marginHorizontal: 15,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#E9EAEC',
        padding: 10
    },
    input1: {
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#E9EAEC',
        marginVertical: 10,
        padding: 10,
        textAlignVertical: 'top',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        // flex: 1,
        marginBottom: 8,
        width: 200,
        marginHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#E9EAEC',
        padding: 10
    },
    dateBtn: {
        marginLeft: 0,
    },
    calendarIcon: {
        padding: 8,
        paddingBottom: 15,
        right: 50
    },
    addBtn: {
        marginVertical: 10,
        backgroundColor: '#0047AB',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        width: '50%',
        top: -100
    },
    addBtnTxt: {
        color: '#fff',
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 0,
        top: -12,
        fontSize: 12,
        fontWeight: '400',
        marginHorizontal: 15,
    },
});

export default AddToDo;
