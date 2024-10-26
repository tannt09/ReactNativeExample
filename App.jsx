/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const db = SQLite.openDatabase({name: 'testDataBase.db', location: 'default'});

const openDatabase = async () => {
  try {
    (await db).transaction(tx => {
      tx.executeSql(
        `CREATE TABlE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
        );`,
      );
    });
  } catch (err) {
    console.error('Open Data Base ERROR :::: ', err);
  }
};

const insertUser = async (name, age) => {
  (await db).transaction(tx => {
    tx.executeSql(
      'INSERT INTO user (name, age) VALUE (?, ?);',
      [name, age],
      (_, result) => console.log('User added successfully! ', result),
      error => console.error('Error inserting user: ', error),
    );
  });
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    openDatabase;
  }, []);

  const addUser = () => insertUser('Van A', 30);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        <Button title="Add User" onPress={addUser} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
