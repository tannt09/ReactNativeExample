import React from 'react';
import {
  Button,
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase({name: 'testDataBase.db', location: 'default'});

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

const AllUserScreen = () => {
  const [listUsers, setListUsers] = React.useState([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const users = await getUsers();
    setListUsers(users);
  };

  const addUser = async (name, age) => {
    await insertUser(name, age);
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
    <View>
      <FlatList
        data={listUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.viewItem}>
            <View style={styles.viewItem}>
              <Text>Name: {item.name}</Text>
              <Text>Age: {item.age}</Text>
              <Button title="Add" onPress={() => addUser('Test01', 25)} />
              <Button title="Delete" onPress={removeUser} />
              <Button title="Edit" onPress={editUser} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AllUserScreen;
