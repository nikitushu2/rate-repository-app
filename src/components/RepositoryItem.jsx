import { Image, StyleSheet, View, Text } from "react-native"

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
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
    backgroundColor: 'white'
  },
  stats: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center'
  }
  });

export default function RepositoryItem({item}) {
    return (
        <>
        <View style={styles.flexContainer}>
            <Image
            style={styles.tinyLogo}
            source={{
            uri: `${item.node.ownerAvatarUrl}`,
            }}
            />
            <View>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>{item.node.fullName}</Text>
                <Text>{item.node.description}</Text>
                <Text style={{backgroundColor: 'lightblue', color: 'white', alignSelf: 'flex-start', padding: 5, borderRadius: 5, marginTop: 5, marginBottom: 5}}>{item.node.language}</Text>
            </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 30, marginLeft: 80, marginVertical: 15}}>
            <View style={styles.stats}>
                <Text>Stars</Text>
                <Text>{(item.node.stargazersCount / 1_000).toFixed(1)}k</Text>
            </View>
            <View style={styles.stats}>
                <Text>Forks</Text>
                <Text>{(item.node.forksCount / 1_000).toFixed(1)}k</Text>
            </View>
            <View style={styles.stats}>
                <Text>Reviews</Text>
                <Text>{item.node.reviewCount > 1000 ? <Text>{(item.node.forksCount / 1_000).toFixed(1)}k</Text> : item.node.reviewCount}</Text>
            </View>
            <View style={styles.stats}>
                <Text>Rating</Text>
                <Text>{item.node.ratingAverage > 1000 ? <Text>{(item.node.ratingAverage / 1_000).toFixed(1)}k</Text> : item.node.ratingAverage}</Text>
            </View>
        </View>
        {/*
        <Text>Full name: {item.fullName}</Text>
        <Text>Description: {item.description}</Text>
        <Text>Language: {item.language}</Text>
        <Text>Stars: {item.stargazersCount}</Text>
        <Text>Forks: {item.forksCount}</Text>
        <Text>Reviews: {item.reviewCount}</Text>
        <Text>Rating: {item.ratingAverage}</Text>*/}
        </>
    )
}