import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
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
    backgroundColor: 'white',
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
    height: screenHeight * 0.4,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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
    marginTop: 0,
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
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2196F3',
    marginBottom: 10,
  },
  currentScoreText: {
    fontSize: 16,
    color: '#4CAF50',
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
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding: 0,
    // elevation: 50,
    // margin: 0,
    // backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  questionCountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#666',
    marginBottom: 10,
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
});
