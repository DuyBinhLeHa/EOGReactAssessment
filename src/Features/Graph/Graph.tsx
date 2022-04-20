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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Chip from '../../components/Chip';
import CustomTooltip from './CustomTooltip';

const client = new ApolloClient({
  uri: 'https://react-assessment.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
query ($input: MeasurementQuery) {
  getMeasurements(input: $input) {
    metric
    at
    value
    unit
  }
}
`;

type GraphData = {
  metric: string;
  at: Date;
  value: number;
  unit: string;
};
type GraphDataResponse = {
  getMeasurements: GraphData[];
};

const SelectBox: FC = () => {
  const input = {
    metricName: 'tubingPressure',
    after: 1650415491332,
    before: 1650415654669,
  };

  const { loading, error, data } = useQuery<GraphDataResponse>(query, {
    variables: {
      input,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  const measureData = data.getMeasurements;

  return (
    <ResponsiveContainer width='100%' height={300} min-width={300}>
      <LineChart
        data={measureData}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 30,
        }}
      >
        <XAxis dataKey="at">
          <Label value="Time" position="bottom" />
        </XAxis>
        <YAxis dataKey="value" type="number" domain={[3.3, 5.6]}>
          <Label value="PSI" angle={-90} position="left" dy="-10" />
        </YAxis>
        <Tooltip content={<CustomTooltip payload={measureData} />} />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <SelectBox />
  </ApolloProvider>
);
