import React from 'react';
import { View, StyleSheet } from 'react-native';

import GameBoard from './components/GameBoard';

const App = () => {
  return (
    <View style={styles.container}>
      <GameBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
