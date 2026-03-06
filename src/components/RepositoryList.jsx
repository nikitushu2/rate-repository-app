import { FlatList, View, StyleSheet } from 'react-native';
import Text from './Text';
import RepositoryItem from './RepositoryItem';
import { useLazyQuery, useQuery } from '@apollo/client';
import {Picker} from '@react-native-picker/picker';
import React, { useState, useRef, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

import { GET_REPOSITORIES } from '../graphql/queries';

const styles = StyleSheet.create({
  separator: {
    height: 10
  },
  flexContainer: {
    flexDirection: 'row',
    backgroundColor: 'white'
  }
});

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [order, setOrder] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)

  return (
    <ThemeContext.Provider value={[order, setOrder, searchQuery, setSearchQuery, debouncedSearchQuery]}>
      {props.children}
    </ThemeContext.Provider>
  )
}


const ItemSeparator = () => <View style={styles.separator} />;


export class RepositoryListContainer extends React.Component {
  Order = () => {
    const props = this.props;
    const pickerRef = useRef();
    const [order, setOrder, searchQuery, setSearchQuery] = useContext(ThemeContext);
    
  
    function open() {
      pickerRef.current.focus();
    }
  
    function close() {
      pickerRef.current.blur();
    }
  
  return (
    <>
  <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
  <Picker
    ref={pickerRef}
    selectedValue={order}
    onValueChange={(itemValue, _itemIndex) =>
      setOrder(itemValue)
    }>
    <Picker.Item label="Latest repositories" value="latest"/>
    <Picker.Item label="Highest rated repositories" value="highest" />
    <Picker.Item label="Lowest rated repositories" value="lowest" />
  </Picker>
  </>
  )
  }

  render() {
    return (
      <FlatList style={{backgroundColor: '#e1e4e8'}}
        data={this.props.data?.repositories?.edges}
        ItemSeparatorComponent={ItemSeparator}
        // other props
        renderItem={({item, index, separators}) => (
          <View style={styles.flexContainer}>
            <View>
              <RepositoryItem item={item}/>
            </View>
          </View>
        )}
        ListHeaderComponent={this.Order}
      />
    );
  }
}

const RepositoryList = () => {
  const [order, _setOrder, searchQuery, _setSearchQuery, debouncedSearchQuery] = useContext(ThemeContext);
  const { data: data1, loading: loading1, error: error1 } = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: {searchKeyword: debouncedSearchQuery}});
  const { data: data2, loading: loading2, error: error2} = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: { orderBy: "RATING_AVERAGE", orderDirection: "DESC", searchKeyword: debouncedSearchQuery }});
  const { data: data3, loading: loading3, error: error3} = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: { orderBy: "RATING_AVERAGE", orderDirection: "ASC", searchKeyword: debouncedSearchQuery }});

  const [data, setData] = useState(data1);

  useEffect(() => {
    if (order === 'latest') {
      setData(data1)
    } else if (order === 'highest') {
      setData(data2)
    } else if (order === 'lowest') {
      setData(data3)
    }
  }, [order, debouncedSearchQuery, data1, data2, data3])

  // Log errors and data for debugging
  useEffect(() => {
    if (error1 || error2 || error3) {
      const error = error1 || error2 || error3;
      console.log('GraphQL Error:', error);
      console.log('Error details:', {
        message: error.message,
        networkError: error.networkError,
        graphQLErrors: error.graphQLErrors
      });
    }
    if (data1) {
      console.log('Repositories data1:', JSON.stringify(data1, null, 2));
      console.log('Repositories count:', data1?.repositories?.edges?.length);
      if (data1?.repositories?.edges?.length === 0) {
        console.log('No repositories found - backend may be empty or query returned no results');
      }
    }
  }, [error1, error2, error3, data1]);

  if (loading1 && !data1) {
    return <View style={{padding: 20}}><Text>Loading repositories...</Text></View>;
  }

  if (error1) {
    const errorMessage = error1.networkError 
      ? `Network error: ${error1.networkError.message}. Make sure the backend server is running at the configured URL.`
      : `Error: ${error1.message}`;
    return (
      <View style={{padding: 20}}>
        <Text style={{color: 'red', marginBottom: 10}}>{errorMessage}</Text>
        <Text style={{fontSize: 12, color: 'gray'}}>Check your .env file and ensure the backend is running.</Text>
      </View>
    );
  }

  if (data1 && data1.repositories && data1.repositories.edges && data1.repositories.edges.length === 0) {
    return (
      <View style={{padding: 20}}>
        <Text>No repositories found.</Text>
        <Text style={{fontSize: 12, color: 'gray', marginTop: 10}}>The backend may not have any data yet.</Text>
      </View>
    );
  }

  return <RepositoryListContainer data={data} />;
};

export default RepositoryList;