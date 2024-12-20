import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')}
      style={styles.background} // 背景图填充整个屏幕
    >
      <View style={styles.container}>
        <Text style={styles.title}>图寻游戏</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Game', { mode: 'westlake' })}
          >
            <Text style={styles.buttonText}>西湖景点</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('WorldGame', { mode: 'world' })}
          >
            <Text style={styles.buttonText}>世界景点</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CSGuesser', { mode: 'cs' })}
          >
            <Text style={styles.buttonText}>CS-Guess</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 将footer放在ImageBackground里面 */}
      <View style={styles.footer}>
        {/* 退出按钮 */}
        <TouchableOpacity style={styles.navButton} onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}>
          <Text style={styles.navButtonText}>退出</Text>
        </TouchableOpacity>

        {/* 我的按钮 */}
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('My')}>
          <Text style={styles.navButtonText}>我的</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 半透明黑色背景
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
  },
  buttonContainer: {
    width: '80%',
    gap: 20,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,  // 减少上下内边距让按钮上移
    position: 'absolute',
    bottom: 50,  // 调整底部位置，使按钮上移
    left: 0,
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

export default HomeScreen;
