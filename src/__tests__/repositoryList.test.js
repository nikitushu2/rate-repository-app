import { render, screen } from '@testing-library/react-native';
import { RepositoryListContainer } from '../components/RepositoryList';

describe('RepositoryList', () => {
    describe('RepositoryListContainer', () => {
        it('renders repository information correctly', () => {
            const data = {
                "repositories": {
                    totalCount: 8,
                    pageInfo: {
                        hasNextPage: true,
                        endCursor:
                            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
                        startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
                    },
                    edges: [
                        {
                            node: {
                                id: 'jaredpalmer.formik',
                                fullName: 'jaredpalmer/formik',
                                description: 'Build forms in React, without the tears',
                                language: 'TypeScript',
                                forksCount: 1619,
                                stargazersCount: 21856,
                                ratingAverage: 88,
                                reviewCount: 2,
                                ownerAvatarUrl:
                                    'https://avatars2.githubusercontent.com/u/4060187?v=4',
                            },
                            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
                        },
                        {
                            node: {
                                id: 'async-library.react-async',
                                fullName: 'async-library/react-async',
                                description: 'Flexible promise-based React data loader',
                                language: 'JavaScript',
                                forksCount: 69,
                                stargazersCount: 1760,
                                ratingAverage: 72,
                                reviewCount: 3,
                                ownerAvatarUrl:
                                    'https://avatars1.githubusercontent.com/u/54310907?v=4',
                            },
                            cursor:
                                'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
                        },
                    ],
                }
            };

            // Add your test code here
            render(<RepositoryListContainer data={data} />);
            screen.debug();

            /*const repositoryItems = screen.getAllByTestId('repositoryItem');
            const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;*/

            expect(screen.getByText(data.repositories.edges[0].node.fullName)).toBeDefined();
            expect(screen.getByText(data.repositories.edges[0].node.description)).toBeDefined();
            expect(screen.getByText(data.repositories.edges[0].node.language)).toBeDefined();
            expect(screen.getByText(`${((data.repositories.edges[0].node.forksCount / 1000).toFixed(1))}k`)).toBeDefined();
            expect(screen.getByText(`${((data.repositories.edges[0].node.stargazersCount / 1000).toFixed(1))}k`)).toBeDefined();
            expect(screen.getByText(`${data.repositories.edges[0].node.ratingAverage}`)).toBeDefined();
            expect(screen.getByText(`${data.repositories.edges[0].node.reviewCount}`)).toBeDefined();

            expect(screen.getByText(data.repositories.edges[1].node.fullName)).toBeDefined();
            expect(screen.getByText(data.repositories.edges[1].node.description)).toBeDefined();
            expect(screen.getByText(data.repositories.edges[1].node.language)).toBeDefined();
            expect(screen.getByText(`${((data.repositories.edges[1].node.forksCount / 1000).toFixed(1))}k`)).toBeDefined();
            expect(screen.getByText(`${((data.repositories.edges[1].node.stargazersCount / 1000).toFixed(1))}k`)).toBeDefined();
            expect(screen.getByText(`${data.repositories.edges[1].node.ratingAverage}`)).toBeDefined();
            expect(screen.getByText(`${data.repositories.edges[1].node.reviewCount}`)).toBeDefined();
        });
    });
});