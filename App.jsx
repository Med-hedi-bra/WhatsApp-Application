import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Auth from './Screens/Auth';
import CreateUser from './Screens/CreateUser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Chat from './Screens/Chat';
import ChatGroup from './Screens/ChatGroup';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
  //  <CreateUser></CreateUser>
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Register" component={CreateUser} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="ChatGroup" component={ChatGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  // <Home></Home>
   
  );
}

