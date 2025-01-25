import Text from './Text';
import { useFormik } from 'formik';
import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';

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
  };

const validationSchema = yup.object().shape({
username: yup
    .string()
    .required('Username is required'),
password: yup
    .string()
    .required('Password is required'),
});

const Form = ({onSubmit}) => {
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
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  </>
  )
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

    const onSubmit = async (values) => {
      const username = values.username;
      const password = values.password;
  
      try {
      const accessToken = await signIn({ username, password });
      console.log('accessToken: ', accessToken);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
    }
  
    return <Form onSubmit={onSubmit} />;
}

export default SignIn;