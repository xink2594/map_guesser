import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Button, 
  Alert,
  Dimensions
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// 获取屏幕高度，用于计算地图和图片区域的大小
const screenHeight = Dimensions.get('window').height;

export default function GameScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // 示例图片 - 需要替换成实际的西湖景点图片
  const sampleImage = {
    uri: 'https://example.com/xihu-image.jpg',
    coordinates: {
      latitude: 30.2590,
      longitude: 120.1490,
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      Alert.alert(
        "选中的位置",
        `纬度: ${selectedLocation.latitude.toFixed(4)}\n经度: ${selectedLocation.longitude.toFixed(4)}`,
        [
          { text: "确定", onPress: () => console.log("确定") }
        ]
      );
    } else {
      Alert.alert("提示", "请先在地图上选择一个位置");
    }
  };

  return (
    <View style={styles.container}>
      {/* 上半部分：地图区域 */}
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
            />
          )}
        </MapView>
        
        {/* 确定位置按钮 */}
        <View style={styles.buttonContainer}>
          <Button
            title="确定位置"
            onPress={handleConfirmLocation}
          />
        </View>
      </View>

      {/* 下半部分：图片显示区域 */}
      <View style={styles.imageContainer}>
        <Image
          source={sampleImage.uri}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: screenHeight * 0.65, // 上半部分占屏幕高度的50%
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    // backgroundColor: 'white',
    // padding: 10,
    // borderRadius: 5,
    elevation: 5, // Android 阴影
    shadowColor: '#000', // iOS 阴影
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    height: screenHeight * 0.5, // 下半部分占屏幕高度的50%
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
