import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Platform,Button,AppState,Keyboard } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { schedulePushNotification,cancelAllScheduledNotifications } from '../notification';

import useGameLogic from '../utils/useGameLogic';

// Add the compareGrid and addNumber functions here
const GameVariablesGrid = {
  //  Size of the grid
  gridSize: 4,
  // Winning state/number of the Game
  winningNumber: 2048,
  twoAppearancePercentage: 0.7,
};



const getRandomItem = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const addNumber = (newGrid) => {
  let options = [];
  for (let i = 0; i < GameVariablesGrid.gridSize; i++) {
    for (let j = 0; j < GameVariablesGrid.gridSize; j++) {
      if (newGrid[i][j] === 0) {
        options.push({ x: i, y: j });
      }
    }
  }

  if (options.length > 0) {
    let spot = getRandomItem(options);
    newGrid[spot.x][spot.y] =
      Math.random() <= GameVariablesGrid.twoAppearancePercentage ? 2 : 4;
  }
};

const GameBoard = () => {
  const {
    swipeLeft,
    swipeRight,
    swipeUp,
    swipeDown,
    isGameWon,
    isGameLost,
    getScore,
    resetScore,
  } = useGameLogic();

  const [board, setBoard] = useState(Array(4).fill(Array(4).fill(0)));

  useEffect(() => {
    placeNewTile();
    placeNewTile();
    resetScore();
  }, []);
  useEffect(() => {
    // Function to handle app state change (foreground/background)
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        // App is in the foreground, cancel all scheduled notifications
        cancelAllScheduledNotifications();
      }
    };

    // Add app state change event listener
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Clean up the listener when the component unmounts
    return () => {
      appStateSubscription.remove();
    };
  }, []);


  const placeNewTile = () => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });
  
    if (emptyCells.length === 0) {
      // Game over condition: no more empty cells to place a new tile
      return;
    }
  
    // Choose a random empty cell
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Randomly choose 2 (70% chance) or 4 (30% chance) to place
    const newValue = Math.random() <= GameVariablesGrid.twoAppearancePercentage ? 2 : 4;
    
    const newBoard = [...board];
    newBoard[row][col] = newValue;
    setBoard(newBoard);
  };

 
  const getTileBackgroundColor = (value) => {
    const colorMapping = {
      0: '#CDC1B4', // Empty tile color
      2: '#EEE4DA',
      4: '#EDE0C8',
      8: '#F2B179',
      16: '#F59563',
      32: '#F67C5F',
      64: '#F65E3B',
      128: '#EDCF72',
      256: '#EDCC61',
      512: '#EDC850',
      1024: '#EDC53F',
      2048: '#EDC22E',
    };

    return colorMapping[value] || '#3C3A32'; // Default color for values greater than 2048
  };

  // Function to handle swipe gestures
  const handleSwipeGesture = ({ nativeEvent }) => {
    const { translationX, translationY, state } = nativeEvent;
    if (state === State.END) {
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX < 0) {
          setBoard((prevBoard) => {
            const newBoard = swipeLeft(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
        } else {
          setBoard((prevBoard) => {
            const newBoard = swipeRight(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
        }
      } else {
        if (translationY < 0) {
          setBoard((prevBoard) => {
            const newBoard = swipeUp(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
        } else {
          setBoard((prevBoard) => {
            const newBoard = swipeDown(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
        }
      }
    }
  };
  const handleKeyboardEvent = (event) => {
    const { keyCode } = event;
    if ([37, 38, 39, 40].includes(keyCode)) {
      event.preventDefault();
      switch (keyCode) {
        case 37: // Left Arrow
          setBoard((prevBoard) => {
            const newBoard = swipeLeft(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
          break;
        case 39: // Right Arrow
          setBoard((prevBoard) => {
            const newBoard = swipeRight(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
          break;
        case 38: // Up Arrow
          setBoard((prevBoard) => {
            const newBoard = swipeUp(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
          break;
        case 40: // Down Arrow
          setBoard((prevBoard) => {
            const newBoard = swipeDown(prevBoard.map((row) => [...row]));
            addNumber(newBoard); // Add a new number after the swipe
            return newBoard;
          });
          break;
        default:
          break;
      }
    }
  };
  
   
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web specific code goes here
      window.addEventListener('keydown', handleKeyboardEvent);

      // Clean up the listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyboardEvent);
      };
    } else {
      // React Native specific code goes here
      const { Keyboard } = require('react-native');

      Keyboard.addListener('keydown', handleKeyboardEvent);

      // Clean up the listener when the component unmounts
      return () => {
        Keyboard.removeListener('keydown', handleKeyboardEvent);
      };
    }
  }, []);
  const handleSendNotification = async () => {
    console.log("triggered");

    try {
      const notificationId = await schedulePushNotification();
      console.log("Notification scheduled with ID:", notificationId);
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  return (
    <View>
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[styles.cell, { backgroundColor: getTileBackgroundColor(cell) }]}
              >
                <Text style={styles.cellText}>{cell === 0 ? '' : cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Text style={styles.scoreText}>Score: {getScore()}</Text>
        {isGameWon(board) && (
        <Text style={styles.messageText}>Congratulations! You've won the game!</Text>
      )}

      {isGameLost(board) && (
        <Text style={styles.messageText}>Game Over! Try again!</Text>
      )}
        <PanGestureHandler onHandlerStateChange={handleSwipeGesture}>
          <View style={styles.gestureHandlerContainer} />
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
    <View>
       <Button title="notify" onPress={()=>handleSendNotification()}/>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    marginTop: 20,
    backgroundColor: '#BBADA0',
    padding: 5,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 70,
    height: 70,
    backgroundColor: '#CDC1B4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#776E65',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#776E65',
    alignSelf: 'center',
    marginVertical: 10,
  },
  gestureHandlerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000', // Customize the color for the messages
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default GameBoard;
