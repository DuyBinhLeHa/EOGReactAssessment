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
  const measureData = [];
  for (let i = 0; i < data.getMultipleMeasurements.length; i += 1) {
    measureData[i] = data.getMultipleMeasurements[i].measurements;
  }
  console.log(measureData);

  return (
    <div>
      <ResponsiveContainer width='100%' height={300} min-width={300}>
        <LineChart
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <XAxis dataKey="at" allowDuplicatedCategory={false}>
            <Label value="Time" position="bottom" />
          </XAxis>
          <YAxis dataKey="value" type="number" domain={['auto', 'auto']} tickCount={10} yAxisId={1}>
            <Label value="PSI" position="bottom" />
          </YAxis>
          <YAxis dataKey="value" type="number" domain={['auto', 'auto']} tickCount={10} yAxisId={2}>
            <Label value="F" position="bottom" />
          </YAxis>
          <YAxis dataKey="value" type="number" domain={['auto', 'auto']} tickCount={10} yAxisId={3}>
            <Label value="%" position="bottom" />
          </YAxis>
          <Tooltip content={<CustomTooltip payload={measureData} />} />
          {
            measureData[0] ? (
              <Line type="monotone" data={measureData[0]} dataKey="value" stroke="#008000" dot={false} yAxisId={1} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[1] ? (
              <Line type="monotone" data={measureData[1]} dataKey="value" stroke="#FF0000" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[2] ? (
              <Line type="monotone" data={measureData[2]} dataKey="value" stroke="#FFA500" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[3] ? (
              <Line type="monotone" data={measureData[3]} dataKey="value" stroke="#FF1493" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[4] ? (
              <Line type="monotone" data={measureData[4]} dataKey="value" stroke="#800080" dot={false} yAxisId={1} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[5] ? (
              <Line type="monotone" data={measureData[5]} dataKey="value" stroke="#C0C0C0" dot={false} yAxisId={3} />
            ) : (
              <div>&nbsp;</div>
            )
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
