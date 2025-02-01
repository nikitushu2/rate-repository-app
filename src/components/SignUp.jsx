import { Text } from "react-native"
import { useFormik } from 'formik';
import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutations";

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
    password: '',
    passwordConfirmation: ''
  };

const validationSchema = yup.object().shape({
username: yup
    .string()
    .min(5)
    .max(30)
    .required('Username is required'),
password: yup
    .string()
    .min(5)
    .max(50)
    .required('Password is required'),
passwordConfirmation: yup
    .string()
    .min(5)
    .max(50)
    .oneOf([yup.ref('password'), null])
    .required('Password confirmation is required'),
});

export function SignUpForm({onSubmit}) {
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
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        secureTextEntry
        style={[styles.input, formik.touched.password && formik.errors.password && styles.inputError]}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.password}</Text>
      )}
      <TextInput
        placeholder="Password confirmation"
        value={formik.values.passwordConfirmation}
        onChangeText={formik.handleChange('passwordConfirmation')}
        secureTextEntry
        style={[styles.input, formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && styles.inputError]}
      />
      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text style={{ color: '#d73a4a' }}>{formik.errors.passwordConfirmation}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
        </>
    )
}

export default function SignUp() {
    const [signIn] = useSignIn();
  const navigate = useNavigate();
  const [mutate, result] = useMutation(SIGN_UP);

    const onSubmit = async (values) => {
      const username = values.username;
      const password = values.password;
  
      try {
        const { data } = await mutate({
            variables: {
                user: {
                    username,
                    password
                },
            },
        });
      const accessToken = await signIn({ username, password });
      console.log('accessToken: ', accessToken);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
    }
  
    return <SignUpForm onSubmit={onSubmit} />;
}