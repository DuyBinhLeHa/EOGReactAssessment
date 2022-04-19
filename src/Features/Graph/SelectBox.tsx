import React, { FC } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import Select from 'react-select';
import Chip from '../../components/Chip';

const client = new ApolloClient({
  uri: 'https://react-assessment.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
  query {
    getMetrics
  }
`;

const SelectBox: FC = () => {
  const { loading, error, data } = useQuery(query);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  const metricName = data.getMetrics;

  return (
    <Select isMulti options={metricName.map((name: string) => ({ label: name, value: name }))} />
  );
};

export default () => (
  <ApolloProvider client={client}>
    <SelectBox />
  </ApolloProvider>
);
