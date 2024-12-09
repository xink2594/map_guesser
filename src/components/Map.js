// components/Map.js
import MapView, { Marker } from 'react-native-maps';

const Map = ({ onLocationSelect }) => {
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    onLocationSelect({ latitude, longitude });
  };

  return (
    <MapView
      style={{ flex: 1 }}
      onPress={handleMapPress}
    />
  );
};
