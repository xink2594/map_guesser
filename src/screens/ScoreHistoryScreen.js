import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScoreHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('westlake');
  const [westlakeHistory, setWestlakeHistory] = useState([]);
  const [worldHistory, setWorldHistory] = useState([]);
  const [csHistory, setCsHistory] = useState([]);

  useEffect(() => {
    loadAllHistory();
  }, []);

  const loadAllHistory = async () => {
    try {
      // 加载西湖记录
      const westlake = await AsyncStorage.getItem('westlakeHistory');
      if (westlake) {
        setWestlakeHistory(JSON.parse(westlake));
      }
      
      // 加载世界记录
      const world = await AsyncStorage.getItem('scoreHistory');
      if (world) {
        setWorldHistory(JSON.parse(world));
      }
      
      // 加载CS记录
      const cs = await AsyncStorage.getItem('csHistory');
      if (cs) {
        setCsHistory(JSON.parse(cs));
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreText}>得分: {item.score}</Text>
      <Text style={styles.dateText}>日期: {item.date}</Text>
    </View>
  );

  const renderTabContent = () => {
    let data = [];
    switch (activeTab) {
      case 'westlake':
        data = westlakeHistory;
        break;
      case 'world':
        data = worldHistory;
        break;
      case 'cs':
        data = csHistory;
        break;
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>暂无历史记录</Text>
        }
      />
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
      defaultSource={require('../../assets/img/background.jpg')}
    >
      <View style={styles.container}>
        <Text style={styles.title}>历史成绩</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'westlake' && styles.activeTab]}
            onPress={() => setActiveTab('westlake')}
          >
            <Text style={[styles.tabText, activeTab === 'westlake' && styles.activeTabText]}>
              西湖景点
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'world' && styles.activeTab]}
            onPress={() => setActiveTab('world')}
          >
            <Text style={[styles.tabText, activeTab === 'world' && styles.activeTabText]}>
              世界景点
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'cs' && styles.activeTab]}
            onPress={() => setActiveTab('cs')}
          >
            <Text style={[styles.tabText, activeTab === 'cs' && styles.activeTabText]}>
              CS-Guess
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scoreItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    marginTop: 20,
  },
});

export default ScoreHistoryScreen; 