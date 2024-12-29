import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    scoreArea: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      height: 100,
      borderBottomWidth: 1,
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
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginVertical: 10,
      marginBottom: 20,
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
      fontSize: 14,
      color: '#000',
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingText: {
      fontSize: 16,
      color: '#000',
      textAlign: 'center',
    },
    mapPressed: {
      // opacity: 0.01,
    },
    button: {
      backgroundColor: '#2196F3',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 120,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#B0BEC5',
      opacity: 0.7,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
  });