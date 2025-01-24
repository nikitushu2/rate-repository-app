import { View, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import { Link } from 'react-router-native';
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 30,
    backgroundColor: '#24292e',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  // ...
});

const AppBar = () => {
  return (
    <View style={styles.container}>
        <ScrollView horizontal>
    <Pressable>
  <Link to="/"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Repositories</Text></View></Link>
  </Pressable>
  <Pressable>
  <Link to="/signin"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Sign in</Text></View></Link>
  </Pressable>
  </ScrollView>
  </View>
  )
};

export default AppBar;