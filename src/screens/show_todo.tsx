import { FlatList, Image, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';

import { RootStackParamList, RootTabParamList } from '../App'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Header from '../components/header';
import TodoItem from '../components/todoItem';

type HomeProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
    route: RouteProp<RootTabParamList, 'TodoList'>;
};

interface Todo {
    id: string;
    title: string;
    desc: string;
    date: string;
    time: string;
    isDone: boolean;
}

const ShowToDo: React.FC<HomeProps> = ({ navigation }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Todos')
            .onSnapshot(querySnapshot => {
                const fetchedTodos: Todo[] = [];

                querySnapshot.forEach(documentSnapshot => {
                    fetchedTodos.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    } as Todo);
                });

                const sortedTodos = fetchedTodos.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA.getTime() - dateB.getTime();
                });

                setTodos(sortedTodos);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric' } as const;
        return date.toLocaleDateString(undefined, options);
    };

    const groupedTodos = todos.reduce((sections, todo) => {
        const formattedDate = formatDate(todo.date); // Format the date to "Month Day"
        const section = sections.find(section => section.title === formattedDate);

        if (section) {
            section.data.push(todo);
        } else {
            sections.push({ title: formattedDate, data: [todo] });
        }

        return sections;
    }, [] as { title: string; data: Todo[] }[]);


    const toggleTodoDone = async (todoId: string, currentStatus: boolean) => {
        try {
            await firestore().collection('Todos').doc(todoId).update({
                isDone: !currentStatus,
            });
        } catch (error) {
            console.error("Error updating isDone status in Firestore:", error);
        }
    };

    const handleDismiss = (id: string) => {
        firestore()
            .collection('Todos')
            .doc(id)
            .delete()
            .then(() => {
                console.log(`Todo item with id ${id} deleted successfully`);
            })
            .catch(error => {
                console.error(`Error deleting todo item with id ${id}: `, error);
            });
    };


    return (
        <View style={styles.container}>
            <Header />
            {groupedTodos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../assets/image2.png')}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.emptyText}>You have no tasks</Text>
                    <Text style={styles.emptySubText}>Add something below</Text>
                </View>
            ) : (
                <SectionList
                    sections={groupedTodos}
                    keyExtractor={(item) => item.id}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{title}</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <TodoItem
                            id={item.id}
                            title={item.title}
                            description={item.desc}
                            date={item.date}
                            time={item.time}
                            isDone={item.isDone}
                            onToggle={toggleTodoDone}
                            onDismiss={handleDismiss}
                        />
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.floatingBtn}
                onPress={() => navigation.navigate('Add')}
            >
                <Icon name='plus' size={30} color='#FFF' />
            </TouchableOpacity>

        </View>
    );
};

export default ShowToDo

const styles = StyleSheet.create({
    container: {

    },

    sectionHeader: {
        backgroundColor: '#A7C7E7',
        padding: 2,
        borderRadius: 5,
        margin: 5,
        marginBottom: 0,
        alignItems: 'center',
        width: '30%',
        justifyContent: 'center',
        left: 230,

    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },

    floatingBtn: {
        borderWidth: 1,
        borderColor: '#0047AB',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        position: 'absolute',
        top: 600,
        right: 20,
        height: 70,
        backgroundColor: '#0047AB',
        borderRadius: 100,
    },
    listContainer: {
        paddingVertical: 20
    },
    todo: {
        height: 70,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    dateStyle: {
        // paddingVertical: 15
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 30
    },
    list: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    listTitle: {
        fontSize: 15,
        fontWeight: '600'
    },
    listDesc: {
        fontSize: 15,
        fontWeight: '400'
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        height: 350,
        width: 250,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        top: -40,
        color: '#000'
    },
    emptySubText: {
        fontSize: 15,
        top: -40,
        color: 'grey'
    },
})