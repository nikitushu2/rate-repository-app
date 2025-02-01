import { Image, StyleSheet, View, Text, Pressable, Linking, FlatList, Button, Alert } from "react-native"
import { Link } from "react-router-native";
import { useNavigate, useLocation } from "react-router-native";
import { GET_REVIEWS, GET_REPOSITORY, GET_REPOSITORIES } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { DELETE_REVIEW } from "../graphql/mutations";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    /*separatorReviews: {
      height: 10,
      backgroundColor: '#e1e4e8'
    },*/
    tinyLogo: {
      width: 50,
      height: 50,
      borderRadius: 5,
      margin: 10
    },
    logo: {
      width: 66,
      height: 58,
    },
  flexContainer: {
    flexDirection: 'row',
    //backgroundColor: 'orange',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center'
  },
  textWithBorder: {
    borderWidth: 2,      
    borderColor: 'darkblue',  
    borderRadius: 25,         
    padding: 10,              
    width: 50,                
    height: 50,               
    justifyContent: 'center', 
    alignItems: 'center',     
    textAlign: 'center',     
    fontSize: 25,             
    color: 'darkblue',        
  },
  });

export const ItemSeparator = () => <View style={{height: 10, backgroundColor: '#e1e4e8'}} />;

export const ReviewItem = ({ review, myreviews=false, refetch }) => {
  const navigate = useNavigate();
  const [mutate, result] = useMutation(DELETE_REVIEW)
  const splittedId = review.node.id.split(".")
  const id = `${splittedId[1]}.${splittedId[2]}`
  const { data } = useQuery(GET_REPOSITORIES, {fetchPolicy: 'cache-and-network'})
  const item = data?.repositories?.edges.find(query => query.node.id === id);

  function onDelete() {
    Alert.alert('Delete review', 'Are you sure you want to delete this review?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Delete', onPress: 
        async () => {
          try {
            mutate({ variables: { deleteReviewId: review.node.id } })
              .then(() => refetch());
            
          } catch(error) {
            console.log('error: ', error)
          }
  }
  },

    ]);
  }
  

  // Single review item
  return (
    <>
    <View style={{display: 'flex', flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Text style={[styles.textWithBorder, {marginLeft: 10, marginTop: 10}]}>{review.node.rating}</Text>
      <View style={{marginRight: 10, marginTop: 10, marginBottom: 10}}>
      <Text style={{fontWeight: 'bold'}}>{review.node.user.username}</Text>
      <Text style={{color: 'grey'}}>{review.node.createdAt.replace(/^(\d{4})-(\d{2})-(\d{2})T.*$/, '$3.$2.$1')}</Text>
      <Text style={{maxWidth: '95%', flexWrap: 'wrap'}}>{review.node.text}</Text>
      <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
      {myreviews && <Pressable onPress={() => navigate(`/${id}`, {state: {item}})} style={{backgroundColor: 'darkblue', padding: 5, borderRadius: 5, marginVertical: 10, width: 113}}><Text style={{color: 'white', fontWeight: 'bold'}}>View repository</Text></Pressable>}
      {myreviews && <Pressable onPress={() => onDelete()} style={{backgroundColor: 'darkred', padding: 5, borderRadius: 5, marginVertical: 10, width: 100}}><Text style={{color: 'white', fontWeight: 'bold'}}>Delete review</Text></Pressable>}
      </View>
      </View>
    </View>
    </>
  )
};

export default function RepositoryItem({item, singleView}) {
  const navigate = useNavigate();
  const location = useLocation();

  const repoItem = item || location.state?.item;

  const [fetchReviews, { data, fetchMore }] = useLazyQuery(GET_REVIEWS);

  const handleFetchMore = () => {
    fetchReviews({ variables: { id: repoItem.node.id } })
      .then(() => {
        const canFetchMore = data.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor
      },
    });
      });

  };

// Trigger the query if repoItem exists
useEffect(() => {
  if (location.state?.item) {
    fetchReviews({ variables: { id: repoItem.node.id } });
  }
}, [repoItem]);

  //const { data } = useQuery(GET_REVIEWS, {variables: { id: repoItem.node.id }});

  const openGitHubLink = () => {
    Linking.openURL(repoItem.node.url);
  };

  function handlePress() {
    if (!singleView) {
      navigate(`/${repoItem.node.id}`, { state: { item } });
    }
  }

    return (
        <>
        <Pressable onPress={handlePress}>
        <View testID="repositoryrepoItem">
        <View style={styles.flexContainer}>
            <Image
            style={styles.tinyLogo}
            source={{
            uri: `${repoItem.node.ownerAvatarUrl}`,
            }}
            />
            <View>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>{repoItem.node.fullName}</Text>
                <Text style={{flexWrap: 'wrap', maxWidth: '90%', marginRight: 10}}>{repoItem.node.description}</Text>
                <Text style={{backgroundColor: 'lightblue', color: 'white', alignSelf: 'flex-start', padding: 5, borderRadius: 5, marginTop: 5, marginBottom: 5}}>{repoItem.node.language}</Text>
            </View>
        </View>
        
        <View style={{display: 'flex', flexDirection: 'row', gap: 30, marginLeft: 80, marginVertical: 15}}>
            <View style={styles.stats}>
                <Text>Stars</Text>
                <Text>{(repoItem.node.stargazersCount / 1_000).toFixed(1)}k</Text>
            </View>
            <View style={styles.stats}>
                <Text>Forks</Text>
                <Text>{(repoItem.node.forksCount / 1_000).toFixed(1)}k</Text>
            </View>
            <View style={styles.stats}>
                <Text>Reviews</Text>
                <Text>{repoItem.node.reviewCount > 1000 ? <Text>{(repoItem.node.forksCount / 1_000).toFixed(1)}k</Text> : repoItem.node.reviewCount}</Text>
            </View>
            <View style={styles.stats}>
                <Text>Rating</Text>
                <Text>{repoItem.node.ratingAverage > 1000 ? <Text>{(repoItem.node.ratingAverage / 1_000).toFixed(1)}k</Text> : repoItem.node.ratingAverage}</Text>
            </View>
        </View>
            {singleView && (
              <View>
              <Pressable onPress={openGitHubLink} style={{marginLeft: 160, marginVertical: 15, backgroundColor: 'darkblue', width: 110, padding: 5, borderRadius: 5}}><Text style={{fontWeight: 'bold', color: 'white'}}>Open in GitHub</Text></Pressable>
            </View>
            )}
        </View>
        </Pressable>
        <FlatList
          style={{backgroundColor: '#e1e4e8'}}
          data={data?.repository?.reviews?.edges}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={({ id }) => id}
          //ListHeaderComponent={() => <View style={{height: 10, backgroundColor: '#e1e4e8'}} />}
          ItemSeparatorComponent={ItemSeparator}
          onEndReached={handleFetchMore}
          onEndReachedThreshold={0.5}
        />
        </>
    )
}
