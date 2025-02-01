import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';
import RepositoryList from './RepositoryList';
import SignIn from './SignIn';
import AppBar from './AppBar';
import { Route, Routes, Navigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import ReviewForm from './ReviewForm';
import CreateReview from './ReviewForm';
import SignUp from './SignUp';
import { ThemeProvider } from './RepositoryList';
import MyReviews from './MyReviews';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <ThemeProvider>
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:id" element={<RepositoryItem singleView={true} />} />
        <Route path="/review" element={<CreateReview />} />
        <Route path="/myreviews" element={<MyReviews />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
    </ThemeProvider>
  );
};

export default Main;