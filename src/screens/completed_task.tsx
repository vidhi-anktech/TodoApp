import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '../App';
import firestore from '@react-native-firebase/firestore';
import TodoItem from '../components/todoItem';

type CompletedTaskProps = {
    navigation: NativeStackNavigationProp<RootTabParamList, 'Completed'>;
    route: RouteProp<RootTabParamList, 'Completed'>;
};

interface Todo {
    id: string;
    title: string;
    desc: string;
    date: string;
    time: string;
    isDone: boolean;
}

const CompletedTask: React.FC<CompletedTaskProps> = ({ navigation, route }) => {

    const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Todos')
            .onSnapshot(querySnapshot => {
                const fetchedCompletedTodos: Todo[] = [];

                querySnapshot.forEach(documentSnapshot => {
                    const todo = documentSnapshot.data() as Todo;
                    if (todo.isDone) {
                        fetchedCompletedTodos.push({
                            ...todo,
                            id: documentSnapshot.id,
                        });
                    }
                });

                setCompletedTodos(fetchedCompletedTodos);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric' } as const;
        return date.toLocaleDateString(undefined, options);
    };

    const groupedCompletedTodos = completedTodos.reduce((sections, todo) => {
        const formattedDate = formatDate(todo.date);
        const section = sections.find(section => section.title === formattedDate);

        if (section) {
            section.data.push(todo);
        } else {
            sections.push({ title: formattedDate, data: [todo] });
        }

        return sections;
    }, [] as { title: string; data: Todo[] }[]);

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

    const toggleTodoDone = async (todoId: string, currentStatus: boolean) => {
        try {
            await firestore().collection('Todos').doc(todoId).update({
                isDone: !currentStatus,
            });
        } catch (error) {
            console.error("Error updating isDone status in Firestore:", error);
        }
    };

    return (
        <View style={styles.container}>

            {groupedCompletedTodos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image source={require('../assets/oops1.png')} style={styles.emptyImage} />
                    <Text style={styles.emptyText}>OOPS!</Text>
                    <Text style={styles.emptySmallText}>No Completed Task</Text>
                </View>
            ) : (
                <>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Done and Dusted</Text>
                        <Image source={require('../assets/emoji.png')} style={styles.emoji} />
                    </View>
                    <SectionList
                        sections={groupedCompletedTodos}
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
                                onDismiss={handleDismiss}
                                onToggle={toggleTodoDone}
                            />
                        )}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    headerContainer: {
        flexDirection: 'row'
    },
    header: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    emoji: {
        height: 50,
        width: 50,
        bottom: -15,
        right: 15
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 50
    },
    emptyImage: {
        height: 350,
        width: 300
    },
    emptyText: {
        fontSize: 25,
        fontWeight: '600',
        top: -30,
        color: '#000'
    },
    emptySmallText: {
        fontSize: 20,
        top: -30,
        color: 'grey'
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
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CompletedTask;
