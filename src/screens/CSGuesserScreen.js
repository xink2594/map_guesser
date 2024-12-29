import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Button,
  Alert,
  ImageBackground,
  Pressable 
} from 'react-native';
import { CS_MAPS } from '../constants/CS';
import { styles } from '../styles/CSGuesserScreenStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const MAX_ROUNDS = 5; // 最大题目数

export default function CSGuesserScreen() {
  const [currentSpot, setCurrentSpot] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [score, setScore] = useState(0);
  const [showMapSelection, setShowMapSelection] = useState(true);
  const [showCorrectPosition, setShowCorrectPosition] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentScore, setCurrentScore] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isMapCorrect, setIsMapCorrect] = useState(false);
  const [usedSpots, setUsedSpots] = useState([]);
  const [roundScores, setRoundScores] = useState([]);

  const getRandomSpot = () => {
    // 创建所有可用题目的数组
    let allSpots = [];
    CS_MAPS.forEach(map => {
      map.spots.forEach(spot => {
        allSpots.push({ ...spot, correctMap: map });
      });
    });
    
    // 过滤掉已使用的题目
    const availableSpots = allSpots.filter(spot => 
      !usedSpots.some(usedSpot => 
        usedSpot.image === spot.image && 
        usedSpot.correctMap.id === spot.correctMap.id
      )
    );
    
    // 如果没有可用题目，返回 null
    if (availableSpots.length === 0) {
      return null;
    }
    
    // 随机选择一个可用题目
    const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    return randomSpot;
  };

  useEffect(() => {
    const initialSpot = getRandomSpot();
    setCurrentSpot(initialSpot);
    setUsedSpots([initialSpot]);
  }, []);

  const handleMapSelect = (map) => {
    setSelectedMap(map);
    setShowMapSelection(false);
  };

  const handleBackToMapSelection = () => {
    setSelectedMap(null);
    setSelectedPosition(null);
    setShowMapSelection(true);
    setShowCorrectPosition(false);
  };

  const handlePositionSelect = (event) => {
    if (!selectedMap || showCorrectPosition) return;

    const { locationX, locationY } = event.nativeEvent;
    const imageWidth = screenWidth - 40;
    const x = (locationX / imageWidth) * 100;
    const y = (locationY / imageWidth) * 100;
    
    setSelectedPosition({ x, y });
  };

  const calculateLineStyle = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return {
      width: `${distance}%`,
      transform: [{ rotate: `${angle}deg` }],
      position: 'absolute',
      left: `${point1.x}%`,
      top: `${point1.y}%`,
      transformOrigin: 'left',
      height: 2,                    // 使用固定高度
      backgroundColor: 'transparent',// 确保背景透明
      borderTopWidth: 2,           // 只使用顶部边框
      borderStyle: 'dashed',
      borderColor: '#FFFFFF',
    };
  };

  const handleSubmitPosition = () => {
    if (!selectedPosition || showCorrectPosition) return;// 未选择位置或已展示正确位置时返回
    
    setShowCorrectPosition(true);
    const mapIsCorrect = currentSpot.correctMap.id === selectedMap.id;
    setIsMapCorrect(mapIsCorrect);
    
    let newScore = 0;
    if (mapIsCorrect) {
      const distance = calculateDistance(selectedPosition, currentSpot.coordinates);
      newScore = Math.max(20, Math.round(100 - distance * 2));
      setCurrentScore(newScore);
      setScore(prevScore => prevScore + newScore);
    }else {
      setCurrentScore(0);
      setSelectedMap(currentSpot.correctMap);// 错误时显示正确地图
    }

    // 记录这一轮的得分
    setRoundScores(prev => [...prev, newScore]);
  };

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + 
      Math.pow(point1.y - point2.y, 2)
    );
  };

  const handleNextRound = async () => {
    const finalScore = score + currentScore;
    if (currentRound >= MAX_ROUNDS) {
      setGameOver(true);
      Alert.alert(
        "游戏结束",
        `完成${MAX_ROUNDS}道题目\n总分: ${score}分`,
        [{ text: "确定", onPress: () => {
          setCurrentRound(1);
          setScore(0);
          setGameOver(false);
          setUsedSpots([]);
          setSelectedMap(null);
          setSelectedPosition(null);
          setShowMapSelection(true);
          setShowCorrectPosition(false);
          setCurrentScore(null);
          setIsMapCorrect(false);
          setRoundScores([]); // 重置轮次得分

          const initialSpot = getRandomSpot();
          setCurrentSpot(initialSpot);
          setUsedSpots([initialSpot]);
        }}]
      );

      // 后台保存分数记录
      try {
        const existingHistory = await AsyncStorage.getItem('csHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        
        const newRecord = {
          score: finalScore,
          date: new Date().toLocaleString('zh-CN'),
          roundScores: roundScores, // 保存轮次得分
        };
        
        history.unshift(newRecord);
        const updatedHistory = history.slice(0, 20);
        await AsyncStorage.setItem('csHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('保存分数失败:', error);
      }

      return;
    }else {
      const nextSpot = getRandomSpot();
      setCurrentSpot(nextSpot);
      setUsedSpots(prev => [...prev, nextSpot]);
      setCurrentRound(prev => prev + 1);
      setSelectedMap(null);
      setSelectedPosition(null);
      setShowMapSelection(true);
      setShowCorrectPosition(false);
      setCurrentScore(null);
    }

    
  };

  if (!currentSpot) return (
    <View style={styles.container}>
      <Text style={styles.errorText}>无法加载题目，请重新开始游戏</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 分数显示区域 */}
      <View style={styles.scoreArea}>
        <Text style={styles.roundText}>第 {currentRound}/{MAX_ROUNDS} 题</Text>
        {currentScore !== null && (
          <Text style={styles.currentScoreText}>
            本题得分: {currentScore}
          </Text>
        )}
        {/* {selectedPosition && showCorrectPosition && (
          <Text style={styles.positionText}>
            选择位置: X:{selectedPosition.x.toFixed(1)}, Y:{selectedPosition.y.toFixed(1)}
          </Text>
        )} */}
        <Text style={styles.totalScoreText}>总分: {score}</Text>
      </View>

      {/* 当前图片 */}
      <View style={styles.spotImageContainer}>
        <Image
          source={currentSpot.image}
          style={styles.spotImage}
          resizeMode="contain"
        />
      </View>

      {/* 地图选择界面 */}
      {showMapSelection ? (
        <ScrollView style={styles.mapSelection}>
          <Text style={styles.instruction}>这个位置在哪张地图上？</Text>
          <View style={styles.mapsGrid}>
            {CS_MAPS.map(map => (
              <TouchableOpacity
                key={map.id}
                style={styles.mapItem}
                onPress={() => handleMapSelect(map)}
              >
                <Image
                  source={map.thumbnail}
                  style={styles.mapThumb}
                  resizeMode="cover"
                />
                <Text style={styles.mapName}>{map.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* 位置选择界面 */
        <View style={styles.positionSelection}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.button,
                showCorrectPosition && styles.buttonDisabled
              ]}
              onPress={handleBackToMapSelection}
              disabled={showCorrectPosition}
            >
              <Text style={styles.buttonText}>返回选择地图</Text>
            </TouchableOpacity>
            
            {selectedPosition && !showCorrectPosition && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitPosition}
              >
                <Text style={styles.buttonText}>提交位置</Text>
              </TouchableOpacity>
            )}
            
            {showCorrectPosition && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleNextRound}
              >
                <Text style={styles.buttonText}>下一题</Text>
              </TouchableOpacity>
            )}
          </View>

          <Pressable
            onPress={handlePositionSelect}
            style={({pressed}) => [
              styles.mapContainer,
              pressed && styles.mapPressed
            ]}
            disabled={showCorrectPosition} // 提交后禁用点击
          >
            <ImageBackground
              source={selectedMap.fullMap}
              style={styles.fullMap}
              resizeMode="contain"
            >
              {/* 未提交答案,未展示正确位置时显示选择位置 */}
              {selectedPosition && !showCorrectPosition && (
                <View
                  style={[
                    styles.marker,
                    styles.selectedMarker,
                    {
                      left: `${selectedPosition.x}%`,
                      top: `${selectedPosition.y}%`
                    }
                  ]}
                />
              )}
              
              {/* 提交后的显示逻辑 */}
              {showCorrectPosition && (
                <>
                  {/* 地图正确时显示选择位置和连线 */}
                  {isMapCorrect && (
                    <>
                      <View 
                        style={[
                          calculateLineStyle(selectedPosition, currentSpot.coordinates)
                        ]} 
                      />
                      <View
                        style={[
                          styles.marker,
                          styles.selectedMarker,
                          {
                            left: `${selectedPosition.x}%`,
                            top: `${selectedPosition.y}%`
                          }
                        ]}
                      />
                    </>
                  )}
                  
                  {/* 无论地图是否正确都显示正确位置 */}
                  <View
                    style={[
                      styles.marker,
                      styles.correctMarker,
                      {
                        left: `${currentSpot.coordinates.x}%`,
                        top: `${currentSpot.coordinates.y}%`
                      }
                    ]}
                  />
                </>
              )}
            </ImageBackground>
          </Pressable>
        </View>
      )}
    </View>
  );
}

