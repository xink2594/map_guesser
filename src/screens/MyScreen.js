import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MyScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('用户名');
  const [userId, setUserId] = useState('123456');

  const loadUserProfile = async () => {
    try {
      const savedNickname = await AsyncStorage.getItem('userNickname');
      const savedUserId = await AsyncStorage.getItem('userId');

      if (savedNickname) setNickname(savedNickname);
      if (savedUserId) setUserId(savedUserId);
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 页面首次加载时获取用户信息
  useEffect(() => {
    loadUserProfile();
  }, []);

  // 每次页面获得焦点时重新加载用户信息
  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://img1.baidu.com/it/u=2069843627,987151294&fm=253&fmt=auto&app=138&f=JPEG?w=505&h=500' }}
        />
        <Text style={styles.nickname}>昵称: {nickname}</Text>
        <Text style={styles.id}>ID: {userId}</Text>
        <TouchableOpacity 
          style={styles.section} 
          onPress={() => navigation.navigate('ProfileEdit')}
        >
          <Text style={styles.sectionText}>个人资料修改</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.section} 
          onPress={() => navigation.navigate('ScoreHistoryScreen')}
        >
          <Text style={styles.sectionText}>我的历史成绩</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', // 调整内容位置
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // 文字颜色调整为白色
  },
  id: {
    fontSize: 16,
    color: '#fff', // 文字颜色调整为白色
    marginBottom: 20,
  },
  section: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  sectionText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navButton: {
    width: '40%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MyScreen;
