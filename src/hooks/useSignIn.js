import { useMutation } from "@apollo/client";
import { AUTHENTICATE } from "../graphql/mutations";
import useAuthStorage from '../hooks/useAuthStorage';
import { useApolloClient } from "@apollo/client";

const useSignIn = () => {
    const authStorage = useAuthStorage();
    const [mutate, result] = useMutation(AUTHENTICATE);
    const apolloClient = useApolloClient();

    const signIn = async ({ username, password }) => {
        const { data } = await mutate({
            variables: {
                credentials: {
                    username,
                    password,
                },
            },
        });

        const accessToken = data?.authenticate?.accessToken;

        if (accessToken) {
            await authStorage.setAccessToken(accessToken);

            await apolloClient.resetStore();

            return accessToken;
        } else {
            throw new Error("Authentication failed: No access token received.");
        }
    };

    return [signIn, result];
};

export default useSignIn;