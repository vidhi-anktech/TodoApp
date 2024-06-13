import 'react-native-gesture-handler';
import React from 'react';
import AddToDo from './screens/add_todo';
import ShowToDo from './screens/show_todo';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompletedTask from './screens/completed_task';
import Header from './components/header';

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
};

export type RootTabParamList = {
  TodoList: undefined;
  Completed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialTopTabNavigator<RootTabParamList>();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="TodoList" component={ShowToDo} options={{ title: 'To-Do List' }} />
      <Tab.Screen name="Completed" component={CompletedTask} options={{ title: 'Completed Tasks' }} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{ title: '', headerShown: false }} />
        <Stack.Screen name='Add' component={AddToDo} options={{ title: '', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
