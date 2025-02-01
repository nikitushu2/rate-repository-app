import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

export const SIGN_UP = gql`
mutation CreateUser($user: CreateUserInput) {
  createUser(user: $user) {
    id
  }
}
`

export const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput) {
  createReview(review: $review) {
    id
  }
}
`

export const DELETE_REVIEW = gql`
mutation Mutation($deleteReviewId: ID!) {
  deleteReview(id: $deleteReviewId)
}
`