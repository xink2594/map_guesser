import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');

  // 加载用户数据
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // 获取登录时保存的用户名作为ID
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUserId(savedUsername);
      }

      // 获取保存的昵称，如果有的话
      const savedNickname = await AsyncStorage.getItem('nickname');
      if (savedNickname) {
        setNickname(savedNickname);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 保存修改
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('nickname', nickname);
      
      Alert.alert('成功', '个人资料已更新', [
        {
          text: '确定',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>个人资料修改</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>昵称:</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID:</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputDisabled
            ]}
            value={userId}
            placeholder="请输入ID"
            placeholderTextColor="#666"
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存修改</Text>
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
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: 'rgba(200,200,200,0.9)',  // 灰色背景
    color: '#666',  // 灰色文字
  },
});

export default ProfileEditScreen; 