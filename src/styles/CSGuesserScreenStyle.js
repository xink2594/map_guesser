import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(255, 255, 255)',
    },
    scoreArea: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      height: 120,
      // borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    roundText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    currentScoreText: {
      fontSize: 16,
      color: '#2196F3',
      textAlign: 'center',
      marginVertical: 5,
    },
    positionText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
    totalScoreText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 5,
    },
    spotImageContainer: {
      height: 200,
      backgroundColor: 'rgba(240, 240, 240, 1)',
    },
    spotImage: {
      width: '100%',
      height: '100%',
    },
    headerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    mapSelection: {
      flex: 1,
      padding: 20,
    },
    instruction: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    mapsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    mapItem: {
      width: '48%',
      marginBottom: 15,
    },
    mapThumb: {
      width: '100%',
      height: 100,
      borderRadius: 8,
    },
    mapName: {
      textAlign: 'center',
      marginTop: 5,
    },
    positionSelection: {
      flex: 1,
      padding: 20,
    },
    mapContainer: {
      width: '100%',
      aspectRatio: 1,
      position: 'relative',
      backgroundColor: '#adadad'
    },
    fullMap: {
      width: '100%',
      height: '100%',
    },
    marker: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: -6,
      marginTop: -6,
      borderWidth: 2,
      borderColor: '#fff',
    },
    selectedMarker: {
      backgroundColor: '#ff4444',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    correctMarker: {
      backgroundColor: '#4CAF50',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    line: {
      height: 0,
      position: 'absolute',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
      },
  });