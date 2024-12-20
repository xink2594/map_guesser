// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MyScreen from './src/screens/MyScreen';

import LoginScreen from './src/screens/LoginScreen';
import GameScreen from './src/screens/GameScreen';
import WorldGameScreen from './src/screens/WorldGameScreen';
import CSGuesserScreen from './src/screens/CSGuesserScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: '登录' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '首页' }} 
        />
        <Stack.Screen 
          name="My" 
          component={MyScreen} 
          options={{ title: '我的' }} 
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
        <Stack.Screen 
          name="CSGuesser" 
          component={CSGuesserScreen}
          options={{ title: 'CS 图寻' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
