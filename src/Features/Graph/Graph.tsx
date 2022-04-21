/* eslint-disable */
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
import MeasurementInfo from './MeasurementInfo';

/*const client = new ApolloClient({
  uri: 'https://react-assessment.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});*/

const presentTime = new Date().valueOf();
const pastTime = 30 * 60000;

const query = gql`
  query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        at
        value
        unit
      }
    }
  }
`;

const subscription = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

type GraphData = {
  metricName: string;
  after: number;
  before: number;
};

interface GraphProps {
  payload: any;
}

const Graph: FC<GraphProps> = (props) => {
  const input = props.payload;

  const { loading, error, data } = useQuery(query, {
    variables: {
      input,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  // const measureName = data.getMultipleMeasurements[0].metric;
  const measureData = data.getMultipleMeasurements[0].measurements;
  console.log(measureData);

  return (
    <div>
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
          <YAxis dataKey="value" type="number" domain={['auto', 'auto']} tickCount={10} yAxisId={1}>
            <Label value="PSI" position="bottom" />
          </YAxis>
          <YAxis dataKey="value" type="number" domain={['auto', 'auto']} tickCount={10} yAxisId={2}>
            <Label value="F" position="bottom" />
          </YAxis>
          <Tooltip content={<CustomTooltip payload={measureData} />} />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} yAxisId={1} />
          <Line type="monotone" dataKey="value" stroke="#ccc" dot={false} yAxisId={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
