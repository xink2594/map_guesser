import React, { useState, useEffect, useRef } from 'react';
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
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  ScrollView,
  PanResponder
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { WORLD_SPOTS } from '../constants/World';
import { calculateDistance } from '../utils/distance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function WorldGameScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [showActualLocation, setShowActualLocation] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [containerHeight, setContainerHeight] = useState(screenHeight * 0.5);
  const lastHeight = useRef(screenHeight * 0.5);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastHeight.current = containerHeight;
      },
      onPanResponderMove: (_, gesture) => {
        const newHeight = lastHeight.current - gesture.dy;
        if (newHeight >= screenHeight * 0.3 && newHeight <= screenHeight * 0.7) {
          setContainerHeight(newHeight);
        }
      },
      onPanResponderRelease: () => {
        lastHeight.current = containerHeight;
      },
    })
  ).current;

  const getRandomSpot = () => {
    const randomIndex = Math.floor(Math.random() * WORLD_SPOTS.length);
    return WORLD_SPOTS[randomIndex];
  };

  useEffect(() => {
    setCurrentSpot(getRandomSpot());
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

    const newScore = Math.max(0, Math.round(10000 - distance/1000));
    setCurrentScore(newScore);
    setShowActualLocation(true);
  };

  const handleNextSpot = async () => {
    const finalScore = score + currentScore;
    setScore(finalScore);
    
    try {
      const existingHistory = await AsyncStorage.getItem('scoreHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newRecord = {
        score: finalScore,
        date: new Date().toLocaleString('zh-CN'),
      };
      
      history.unshift(newRecord);
      const updatedHistory = history.slice(0, 20);
      await AsyncStorage.setItem('scoreHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('保存分数失败:', error);
    }

    setCurrentSpot(getRandomSpot());
    setSelectedLocation(null);
    setDistance(null);
    setShowActualLocation(false);
    setCurrentScore(0);
  };

  if (!currentSpot) {
    return <View style={styles.container}><Text>加载中...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.mapWrapper, { 
        height: screenHeight - containerHeight
      }]}>
        <View style={styles.mapSection}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 20,
              longitude: 0,
              latitudeDelta: 100,
              longitudeDelta: 100,
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
                  strokeColor="#3498db"
                  strokeWidth={3}
                  lineDashPattern={[8, 8]}
                />
              </>
            )}
          </MapView>

          <View style={styles.scoreOverlay}>
            <View style={styles.scoreCard}>
              <Text style={styles.totalScoreLabel}>总分</Text>
              <Text style={styles.totalScoreValue}>{score}</Text>
            </View>
            {showActualLocation && (
              <View style={styles.currentScoreCard}>
                <Text style={styles.currentScoreValue}>+{currentScore}</Text>
                <Text style={styles.currentScoreLabel}>本次得分</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.contentSection, { 
        height: containerHeight
      }]}>
        <View style={styles.dragHandle} {...panResponder.panHandlers}>
          <View style={styles.dragBar} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              (!selectedLocation || showActualLocation) && styles.disabledButton,
              selectedLocation && !showActualLocation && styles.confirmButton
            ]}
            onPress={handleConfirmLocation}
            disabled={!selectedLocation || showActualLocation}
          >
            <Text style={styles.buttonText}>确定位置</Text>
          </TouchableOpacity>
          
          {showActualLocation && (
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={handleNextSpot}
            >
              <Text style={styles.buttonText}>下一题</Text>
            </TouchableOpacity>
          )}
        </View>

        {distance && showActualLocation && (
          <View style={styles.distanceCard}>
            <Text style={styles.spotNameText}>
              <Text style={styles.spotNameLabel}>正确位置：</Text>
              {currentSpot.name}
            </Text>
            <View style={styles.distanceInfo}>
              <Text style={styles.distanceValue}>{(distance/1000).toFixed(1)}</Text>
              <Text style={styles.distanceLabel}>公里</Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={styles.imageCard}
          activeOpacity={0.95}
        >
          <Image
            source={currentSpot.image}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={currentSpot?.image}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapWrapper: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    paddingBottom: 0,
  },
  mapSection: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentSection: {
    backgroundColor: '#ffffff',
    padding: 15,
    paddingTop: 35,
    alignItems: 'center',
    position: 'relative',
  },
  dragHandle: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  dragBar: {
    width: 60,
    height: 5,
    backgroundColor: '#95a5a6',
    borderRadius: 3,
  },
  scoreOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 15,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 70,
  },
  currentScoreCard: {
    marginLeft: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.95)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  totalScoreLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 2,
  },
  totalScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2980b9',
  },
  currentScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  currentScoreLabel: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 100,
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  nextButton: {
    backgroundColor: '#2ecc71',
  },
  disabledButton: {
    backgroundColor: 'rgba(189, 195, 199, 0.9)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  distanceCard: {
    backgroundColor: '#f1f2f6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 140,
    marginBottom: 15,
  },
  spotNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  spotNameLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  distanceLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  imageCard: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
});
