import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import WorldGameScreen from './src/screens/WorldGameScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '首页' }}
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen}
          options={{ title: '西湖景点图寻' }}
        />
        <Stack.Screen 
          name="WorldGame" 
          component={WorldGameScreen}
          options={{ title: '世界景点图寻' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

