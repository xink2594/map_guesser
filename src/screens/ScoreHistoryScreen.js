import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScoreHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('westlake');
  const [westlakeHistory, setWestlakeHistory] = useState([]);
  const [worldHistory, setWorldHistory] = useState([]);
  const [csHistory, setCsHistory] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderScoreDetails = () => {
    if (!selectedScore) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedScore(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setSelectedScore(null);
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>详细得分</Text>
            <Text style={styles.modalScore}>最终得分: {selectedScore.score}</Text>
            <Text style={styles.modalDate}>日期: {selectedScore.date}</Text>
            {selectedScore.roundScores && (
              <View style={styles.roundScores}>
                {selectedScore.roundScores.map((score, index) => (
                  <Text key={index} style={styles.roundScore}>
                    第 {index + 1} 题: {score} 分
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.scoreItem}
      onPress={() => {
        setSelectedScore(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreText}>得分: {item.score}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.tapHint}>点击查看详情</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
      // defaultSource={require('../../assets/img/background.jpg')}
    >
      <View style={styles.container}>        
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
          <FlatList
            data={activeTab === 'westlake' ? westlakeHistory : 
                  activeTab === 'world' ? worldHistory : 
                  csHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>暂无历史记录</Text>
            }
            // refreshing={}
            // onRefresh={}
          />
        </View>
        {renderScoreDetails()}
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
  scoreItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  roundScores: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  roundScore: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});

export default ScoreHistoryScreen; 