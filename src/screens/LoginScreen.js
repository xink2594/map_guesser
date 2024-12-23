import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // 登录处理
  const handleLogin = async () => {
    if (username && password && isChecked) {
      try {
        // 保存登录状态
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('username', username);
        navigation.replace('Home');
      } catch (error) {
        console.error('登录失败:', error);
        alert('登录失败，请重试');
      }
    } else {
      alert('请输入用户名、密码，并同意用户协议');
    }
  };

  // 退出登录处理
  const handleLogout = async () => {
    try {
      // 清除所有游戏记录和登录状态
      await AsyncStorage.multiRemove([
        'westlakeHistory',
        'scoreHistory',
        'csHistory',
        'isLoggedIn',
        'username'
      ]);
      
      // 清除输入框
      setUsername('');
      setPassword('');
      setIsChecked(false);
      
    } catch (error) {
      console.error('退出登录失败:', error);
      alert('退出登录失败，请重试');
    }
  };

  // 检查登录状态
  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        // 如果已登录，清除所有记录并重置登录状态
        await handleLogout();
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    }
  };

  // 组件加载时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')} // 设置背景图
      style={styles.background} // 背景样式
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>MapGuesser</Text>
          
          <TextInput
            style={styles.input}
            placeholder="请输入账号"
            value={username}
            onChangeText={setUsername}
          />
          
          <TextInput
            style={styles.input}
            placeholder="请输入密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>登录</Text>
          </TouchableOpacity>
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, isChecked && styles.checked]} // 根据勾选状态修改样式
              onPress={() => setIsChecked(!isChecked)} // 切换勾选状态
            >
              {/* 确保✔符号在Text组件内渲染 */}
              {isChecked && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>
            <Text style={styles.footerText}>
              登录表示同意 
              <Text style={styles.link}>用户协议</Text> 和 <Text style={styles.link}>隐私政策</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // 保证内容居中显示
  },
  scrollContainer: {
    flexGrow: 1, // 使 ScrollView 可以滚动
    justifyContent: 'center', // 让内容在 ScrollView 中垂直居中
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 透明的黑色背景层
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.7)', // 输入框的透明背景
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007BFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007BFF', // 勾选时的背景颜色
  },
  checkmark: {
    color: '#fff', // 勾选时的✔符号颜色
  },
});

export default LoginScreen;
