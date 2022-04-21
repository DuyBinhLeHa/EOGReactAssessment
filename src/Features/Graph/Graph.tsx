import React, { FC } from 'react';
import {
  useQuery,
  gql,
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

type GraphProps = {
  payload: any;
};

const Graph: FC<GraphProps> = (props) => {
  const { payload } = props;
  const input = payload;
  const { loading, error, data } = useQuery(query, {
    variables: {
      input,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  const measureData = new Array(6).fill(null);
  for (let i = 0; i < data.getMultipleMeasurements.length; i += 1) {
    if (data.getMultipleMeasurements[i].metric === 'tubingPressure') {
      measureData.splice(0, 1, data.getMultipleMeasurements[i].measurements);
    }
    if (data.getMultipleMeasurements[i].metric === 'waterTemp') {
      measureData.splice(1, 1, data.getMultipleMeasurements[i].measurements);
    }
    if (data.getMultipleMeasurements[i].metric === 'flareTemp') {
      measureData.splice(2, 1, data.getMultipleMeasurements[i].measurements);
    }
    if (data.getMultipleMeasurements[i].metric === 'oilTemp') {
      measureData.splice(3, 1, data.getMultipleMeasurements[i].measurements);
    }
    if (data.getMultipleMeasurements[i].metric === 'casingPressure') {
      measureData.splice(4, 1, data.getMultipleMeasurements[i].measurements);
    }
    if (data.getMultipleMeasurements[i].metric === 'injValveOpen') {
      measureData.splice(5, 1, data.getMultipleMeasurements[i].measurements);
    }
  }

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
              <Line type="monotone" data={measureData[1]} dataKey="value" stroke="#0000FF" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[2] ? (
              <Line type="monotone" data={measureData[2]} dataKey="value" stroke="#FF0000" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[3] ? (
              <Line type="monotone" data={measureData[3]} dataKey="value" stroke="#8B4513" dot={false} yAxisId={2} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[4] ? (
              <Line type="monotone" data={measureData[4]} dataKey="value" stroke="#808080" dot={false} yAxisId={1} />
            ) : (
              <div>&nbsp;</div>
            )
          }
          {
            measureData[5] ? (
              <Line type="monotone" data={measureData[5]} dataKey="value" stroke="#FFFF00" dot={false} yAxisId={3} />
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
