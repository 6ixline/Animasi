import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Animedetails from './screens/Animedetails';
import Episodewatch from './screens/Episodewatch';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <StatusBar style="auto" />
    <View style={styles.container}>                 
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen  name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen  name='Animedetails' component={Animedetails} options={{ headerShown: false }}  />
            <Stack.Screen  name='Episodewatch' component={Episodewatch} options={{ headerShown: false }}  />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
