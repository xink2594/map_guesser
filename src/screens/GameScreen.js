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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showActualLocation, setShowActualLocation] = useState(false);
  const [score, setScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const getRandomSpot = () => {
    const randomIndex = Math.floor(Math.random() * WESTLAKE_SPOTS.length);
    return WESTLAKE_SPOTS[randomIndex];
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

    const newScore = Math.max(0, Math.round(10000 - distance));
    setCurrentScore(newScore);
    setShowActualLocation(true);
  };

  const handleNextSpot = async () => {
    const finalScore = score + currentScore;
    setScore(finalScore);
    
    try {
      const existingHistory = await AsyncStorage.getItem('westlakeHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newRecord = {
        score: finalScore,
        date: new Date().toLocaleString('zh-CN'),
      };
      
      history.unshift(newRecord);
      const updatedHistory = history.slice(0, 20);
      
      await AsyncStorage.setItem('westlakeHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('保存分数失败:', error);
    }

    setCurrentSpot(getRandomSpot());
    setSelectedLocation(null);
    setDistance(null);
    setShowActualLocation(false);
    setCurrentScore(0);
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
          style={styles.map}
          initialRegion={{
            latitude: 30.2590,
            longitude: 120.1490,
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

        <View style={styles.floatingInfo}>
          <Text style={styles.scoreText}>总分: {score}</Text>
          {showActualLocation && (
            <Text style={styles.currentScoreText}>
              本次得分: {currentScore}
            </Text>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedLocation || showActualLocation) && styles.disabledButton,
              selectedLocation && !showActualLocation && styles.activeButton
            ]}
            onPress={handleConfirmLocation}
            disabled={!selectedLocation || showActualLocation}
          >
            <Text style={styles.buttonText}>确定位置</Text>
          </TouchableOpacity>
          
          {showActualLocation && (
            <TouchableOpacity
              style={[styles.confirmButton, styles.activeButton]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: screenHeight * 0.5,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    // backgroundColor: 'white',
    // padding: 10,
    // borderRadius: 5,
    // elevation: 5,
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: screenHeight * 0.5,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '90%',
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  viewFullImage: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  confirmButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.6)',
  },
  activeButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingInfo: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2196F3',
    marginBottom: 10,
  },
  currentScoreText: {
    fontSize: 16,
    color: '#4CAF50',
  },
});
