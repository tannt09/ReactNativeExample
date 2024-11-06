import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import AllUserScreen from './screens/AllUserScreen/AllUserScreen';

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

const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    openDatabase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AllUser">
          <Stack.Screen name="AllUser" component={AllUserScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
