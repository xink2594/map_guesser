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
import MapView, { Marker } from 'react-native-maps';
import { WESTLAKE_SPOTS } from '../constants/WestLake';
import { calculateDistance } from '../utils/distance';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getRandomSpot = () => {
    const randomIndex = Math.floor(Math.random() * WESTLAKE_SPOTS.length);
    return WESTLAKE_SPOTS[randomIndex];
  };

  useEffect(() => {
    setCurrentSpot(getRandomSpot());
  }, []);

  const handleMapPress = (e) => {
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
    if (!selectedLocation) {
      Alert.alert("提示", "请先在地图上选择一个位置");
      return;
    }

    Alert.alert(
      "选中的位置",
      `距离实际位置: ${distance} 米\n纬度: ${selectedLocation.latitude.toFixed(4)}\n经度: ${selectedLocation.longitude.toFixed(4)}`,
      [
        { 
          text: "下一题", 
          onPress: () => {
            setCurrentSpot(getRandomSpot());
            setSelectedLocation(null);
            setDistance(null);
          }
        }
      ]
    );
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
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>
        
        <View style={styles.infoContainer}>
          {/* {distance && (
            <Text style={styles.distanceText}>
              距离: {distance} 米
            </Text>
          )} */}
          <Button
            title="确定位置"
            onPress={handleConfirmLocation}
          />
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
});
