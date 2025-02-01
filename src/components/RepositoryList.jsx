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
  const { data: data1 } = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: {searchKeyword: debouncedSearchQuery}});
  const { data: data2} = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: { orderBy: "RATING_AVERAGE", orderDirection: "DESC", searchKeyword: debouncedSearchQuery }});
  const { data: data3} = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network', variables: { orderBy: "RATING_AVERAGE", orderDirection: "ASC", searchKeyword: debouncedSearchQuery }});

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


  return <RepositoryListContainer data={data} />;
};

export default RepositoryList;