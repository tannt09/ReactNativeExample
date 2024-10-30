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

const getUsers = () => {
  if (!db) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
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
          resolve(users);
        },
        error => {
          console.error('Error fetching users: ', error);
          reject([]);
        },
      );
    });
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

const updateUser = async (id, name, age) => {
  (await db).transaction(tx => {
    tx.executeSql(
      'UPDATE user SET name = ?, age = ? WHERE id = ?;',
      [name, age, id],
      (_, result) => console.log('User update successfully! ', result.raw),
      error => console.error('Error updating user: ', error),
    );
  });
};

const deleteUser = async id => {
  (await db).transaction(tx => {
    tx.executeSql(
      'DELETE FROM user WHERE id = ?;',
      [id],
      (_, result) => console.log('User delete successfully! ', result),
      error => console.error('Error deleting user: ', error),
    );
  });
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [listUsers, setListUsers] = React.useState([]);

  React.useEffect(() => {
    openDatabase();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const users = await getUsers();
    setListUsers(users);
  };

  const addUser = async () => {
    await insertUser('Van A', 30);
    fetchUsers();
  };
  const editUser = async () => {
    await updateUser(2, 'Van B', 20);
    fetchUsers();
  };
  const removeUser = async () => {
    await deleteUser(3);
    fetchUsers();
  };

  console.log('----1111 ', listUsers);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{backgroundStyle}}>
        <Button title="Add User" onPress={addUser} />
        <Button title="Delete User" onPress={removeUser} />
        <Button title="Edit User" onPress={editUser} />
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
