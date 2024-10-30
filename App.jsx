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

const getUsers = async () => {
  if (!db) {
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM user;',
      [],
      (_, {rows}) => {
        let users = [];
        for (let i = 0; i < rows.length; i++) {
          users.push(rows.item(i));
        }
        console.log('Users:', users);
      },
      error => console.error('Error fetching users: ', error),
    );
  });
};

const insertUser = async (name, age) => {
  (await db).transaction(tx => {
    tx.executeSql(
      'INSERT INTO user (name, age) VALUES (?, ?);',
      [name, age],
      (_, result) => console.log('User added successfully! ', result),
      error => console.error('Error inserting user: ', error),
    );
  });
};

const deleteUser = async (id) => {
  (await db).transaction(tx => {
    tx.executeSql(
      'DELETE FROM user WHERE id = ?;',
      [id],
      (_, result) => console.log('User delete successfully! ', result),
      error => console.error('Error delete user: ', error),
    );
  });
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    openDatabase();
  }, []);

  const addUser = async () => await insertUser('Van A', 30);
  const fetchUsers = async () => await getUsers();
  const removeUser = async () => await deleteUser(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{backgroundStyle}}>
        <Button title="Add User" onPress={addUser} />
        <Button title="Get Users" onPress={fetchUsers} />
        <Button title="Delete User" onPress={removeUser} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default App;
