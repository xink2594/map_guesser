import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Button, 
  Alert,
  Dimensions,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { WESTLAKE_SPOTS } from '../constants/WestLake';
import { calculateDistance } from '../utils/distance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/GameScreenStyle';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [showActualLocation, setShowActualLocation] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [questionSequence, setQuestionSequence] = useState([]);
  const mapRef = React.useRef(null);

  const generateQuestionSequence = () => {
    const allIndices = Array.from({ length: WESTLAKE_SPOTS.length }, (_, i) => i);
    const shuffled = [...allIndices];
    
    // Fisher-Yates 洗牌算法
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // 取前5个作为题目序列
    return shuffled.slice(0, 5);
  };

  const getRandomSpot = () => {
    // 如果是新游戏（问题序列为空），生成新的题目序列
    if (questionSequence.length === 0) {
      const newSequence = generateQuestionSequence();
      setQuestionSequence(newSequence);
      return WESTLAKE_SPOTS[questionSequence[questionCount - 1]];
    }
    
    // 返回当前序列中对应的题目
    return WESTLAKE_SPOTS[questionSequence[questionCount - 1]];
  };

  useEffect(() => {
    const newSequence = generateQuestionSequence();
    setQuestionSequence(newSequence);
    setCurrentSpot(WESTLAKE_SPOTS[newSequence[0]]);
  }, []); 

  const handleMapPress = (e) => {
    if (showActualLocation) return; 

    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    
    if (currentSpot) {
      const dist = calculateDistance(
        { latitude, longitude },
        currentSpot.coordinates
      );
      setDistance(dist);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation || showActualLocation) return;

    // 计算得分
    const newScore = Math.max(20, Math.round(100 - distance/25));
    setCurrentScore(newScore);
    setShowActualLocation(true);

    // 动画移动到正确位置
    const region = {
      latitude: (selectedLocation.latitude + currentSpot.coordinates.latitude) / 2,
      longitude: (selectedLocation.longitude + currentSpot.coordinates.longitude) / 2,
      latitudeDelta: Math.abs(selectedLocation.latitude - currentSpot.coordinates.latitude) * 2,
      longitudeDelta: Math.abs(selectedLocation.longitude - currentSpot.coordinates.longitude) * 2,
    };

    // 确保缩放级别不会太大
    region.latitudeDelta = Math.max(region.latitudeDelta, 0.005);
    region.longitudeDelta = Math.max(region.longitudeDelta, 0.005);

    // 添加一点padding以确保两个标记都在视图中
    mapRef.current?.animateToRegion(region, 1000);
  };

  const handleNextSpot = async () => {
    const finalScore = score + currentScore;
    
    if (questionCount >= 5) {
      Alert.alert(
        "游戏结束",
        `您的最终得分是: ${finalScore}分`,
        [
          {
            text: "重新开始",
            onPress: () => {
              const newSequence = generateQuestionSequence();
              setQuestionSequence(newSequence);
              setQuestionCount(1);
              setScore(0);
              setCurrentSpot(WESTLAKE_SPOTS[newSequence[0]]);
              setSelectedLocation(null);
              setDistance(null);
              setShowActualLocation(false);
              setCurrentScore(0);
            }
          }
        ]
      );
    } else {
      // Continue to next question
      setQuestionCount(questionCount + 1);
      setCurrentSpot(WESTLAKE_SPOTS[questionSequence[questionCount]]);
      setSelectedLocation(null);
      setDistance(null);
      setShowActualLocation(false);
      setCurrentScore(0);
      setScore(finalScore);
    }
    
    // 后台保存分数记录
    try {
      const existingHistory = await AsyncStorage.getItem('westlakeHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newRecord = {
        score: score,
        date: new Date().toLocaleString('zh-CN'),
      };
      
      history.unshift(newRecord);
      const updatedHistory = history.slice(0, 20);
      await AsyncStorage.setItem('westlakeHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('保存分数失败:', error);
    }
  };

  const ImageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={currentSpot?.image}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );

  if (!currentSpot) {
    return <View style={styles.container}><Text>加载中...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 30.259,
            longitude: 120.149,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker 
              coordinate={selectedLocation}
              pinColor="red"
            />
          )}
          
          {showActualLocation && (
            <>
              <Marker 
                coordinate={currentSpot.coordinates}
                pinColor="green"
              />
              <Polyline
                coordinates={[
                  selectedLocation,
                  currentSpot.coordinates
                ]}
                strokeColor="#000"
                strokeWidth={2}
                lineDashPattern={[5, 5]}
              />
            </>
          )}
        </MapView>

        {/* 悬浮信息框 */}
        <View style={styles.floatingInfo}>
          <Text style={styles.scoreText}>总分: {score}</Text>
          <Text style={styles.questionCountText}>第 {questionCount}/5 题</Text>
          {showActualLocation && (
            <Text style={styles.currentScoreText}>
              本次得分: {currentScore}
            </Text>
          )}
        </View>
        
        {/* 按钮容器 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!selectedLocation || showActualLocation) && styles.buttonDisabled
            ]}
            onPress={handleConfirmLocation}
            disabled={!selectedLocation || showActualLocation}
          >
            <Text style={styles.buttonText}>确定位置</Text>
          </TouchableOpacity>
          
          {showActualLocation && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleNextSpot}
            >
              <Text style={styles.buttonText}>下一题</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.spotName}>{currentSpot.name}</Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={styles.imageWrapper}
        >
          <Image
            source={currentSpot.image}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.viewFullImage}>点击查看大图</Text>
        </TouchableOpacity>
      </View>

      <ImageModal />
    </View>
  );
}


