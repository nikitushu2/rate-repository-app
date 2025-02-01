import { Image, StyleSheet, View, Text, Pressable, Linking, FlatList } from "react-native"
import { Link } from "react-router-native";
import { useNavigate, useLocation } from "react-router-native";
import { GET_REVIEWS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { ReviewItem, ItemSeparator } from "./RepositoryItem";
import { GET_CURRENT_USER } from "../graphql/queries";

export default function MyReviews() {
    const { data, refetch } = useQuery(GET_CURRENT_USER, {fetchPolicy: 'cache-and-network', variables: {includeReviews: true}});

    return (
        <>
        <FlatList
          style={{backgroundColor: '#e1e4e8'}}
          data={data?.me?.reviews?.edges}
          renderItem={({ item }) => <ReviewItem key={item.id} review={item} myreviews={true} refetch={refetch}/>}
          keyExtractor={({ id }) => id}
          ItemSeparatorComponent={ItemSeparator}
        />
        </>
    )
}