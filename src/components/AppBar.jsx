import { View, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import { Link } from 'react-router-native';
import { ScrollView } from 'react-native';
import { gql, useQuery } from "@apollo/client";
import useAuthStorage from '../hooks/useAuthStorage';
import { useApolloClient } from "@apollo/client";

const GET_ME = gql`
  query {
    me {
      username
    }
  }
`;

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
  const {data} = useQuery(GET_ME);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async() => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  }

  return (
    <View style={styles.container}>
        <ScrollView horizontal>
    <Pressable>
  <Link to="/"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Repositories</Text></View></Link>
  </Pressable>
  {data?.me?.username ? (
    <>
    <Pressable>
    <Link to="/myreviews"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>My reviews</Text></View></Link>
    </Pressable>
    <Pressable>
    <Link to="/review"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Create review</Text></View></Link>
    </Pressable>
    <Pressable onPress={signOut}>
    <View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Sign out</Text></View>
    </Pressable>
    </>
  ) : (
    <>
    <Pressable>
  <Link to="/signin"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Sign in</Text></View></Link>
  </Pressable>
  <Pressable>
  <Link to="/signup"><View><Text style={{color: 'white', margin: 5, fontWeight: 'bold'}}>Sign up</Text></View></Link>
  </Pressable>
  </>
  )}
  </ScrollView>
  </View>
  )
};

export default AppBar;