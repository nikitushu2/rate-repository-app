import { Text } from "react-native";
import { useFormik } from 'formik';
import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "../graphql/mutations";
import { useLazyQuery } from "@apollo/client";
import { GET_REPOSITORY } from "../graphql/queries";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 12,
    },
    button: {
      backgroundColor: '#24292e',
      padding: 12,
      alignItems: 'center',
      borderRadius: 4,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    inputError: {
        borderColor: '#d73a4a',
      },
  });

  const initialValues = {
    username: '',
    repository: '',
    rating: null,
    review: ''
  };

const validationSchema = yup.object().shape({
username: yup
    .string()
    .required('Username is required'),
repository: yup
    .string()
    .required('Repository\'s name is required'),
rating: yup
    .number()
    .min(0)
    .max(100)
    .required('Rating 0-100 is required'),
review: yup
    .string()
});

export function ReviewForm({onSubmit}) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      });

    return (
        <>
        <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        style={[styles.input, formik.touched.username && formik.errors.username && styles.inputError]}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.username}</Text>
      )}
      <TextInput
        placeholder="Repository"
        value={formik.values.password}
        onChangeText={formik.handleChange('repository')}
        style={[styles.input, formik.touched.repository && formik.errors.repository && styles.inputError]}
      />
      {formik.touched.repository && formik.errors.repository && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.repository}</Text>
      )}
      <TextInput
        placeholder="Rating 0-100"
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
        style={[styles.input, formik.touched.rating && formik.errors.rating && styles.inputError]}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.rating}</Text>
      )}
      <TextInput
        placeholder="Review"
        multiline
        value={formik.values.review}
        onChangeText={formik.handleChange('review')}
        style={[styles.input, formik.touched.review && formik.errors.review && styles.inputError]}
      />
      {formik.touched.review && formik.errors.review && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.review}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create review</Text>
      </Pressable>
    </View>
        </>
    )
}

const CreateReview = () => {
    const navigate = useNavigate();
    const [mutate, result] = useMutation(CREATE_REVIEW);
    const [fetchRepository, { data: repositoryData }] = useLazyQuery(GET_REPOSITORY);
    const [repositoryId, setRepositoryId] = useState(null);
  
      const onSubmit = async (values) => {
        const username = values.username;
        const repository = values.repository;
        const rating = Number(values.rating);
        const review = values.review;
    
        try {
        const { data } = await mutate({
            variables: {
                review: {
                    ownerName: username,
                    repositoryName: repository,
                    rating,
                    text: review
                },
            },
        });
        const splittedId = data.createReview.id.split(".")
        const id = `${splittedId[1]}.${splittedId[2]}`
        setRepositoryId(id);

        fetchRepository({ variables: { id } });

        //I couldnt implement navigation to a single review
        navigate(`/`);
        
      } catch (e) {
        console.log(e);
      }
      }
    
    return <ReviewForm onSubmit={onSubmit} />;
  }

export default CreateReview;