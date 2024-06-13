import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import Icon from 'react-native-vector-icons/FontAwesome'


const Header = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const initialDate = new Date();

    const formatDateText = (date: Date) => {
        const dayName = daysOfWeek[date.getDay()];
        const monthName = monthsOfYear[date.getMonth()];
        const dayNumber = date.getDate();
        return `${dayName}, ${monthName} ${dayNumber}`;
    };

    const initialDateText = formatDateText(initialDate);

    const [date, setDate] = useState<Date>(initialDate);
    const [dateText, setDateText] = useState<string>(initialDateText);

    // Update the date text whenever the date changes
    useEffect(() => {
        setDateText(formatDateText(date));
    }, [date]);

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>To do</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{dateText}</Text>
                <Icon name='calendar' style={styles.calendarIcon} size={20} color='#0047AB' />
            </View>
        </View>
    );
};

export default Header

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleText: {
        fontSize: 30,
        fontWeight: '600',
        color: '#000'
    },
    dateContainer: {
        paddingVertical: 10,
        flexDirection: 'row'
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600'
    },
    calendarIcon: {
        paddingHorizontal: 5,
    },
})