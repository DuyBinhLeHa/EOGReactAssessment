import React, { FC } from 'react';
import {
  useQuery,
  gql,
} from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '../../components/Chip';

const query = gql`
  query ($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

type MeasureBoardProps = {
  payload: any;
};

const MeasureBoard: FC<MeasureBoardProps> = (props) => {
  const { payload } = props;
  const input = payload;
  const { loading, error, data } = useQuery(query, {
    variables: {
      metricName: input,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  const measureInfo = data;

  return (
    <Card>
      <CardContent>
        {measureInfo.metric}
        {measureInfo.value}
      </CardContent>
    </Card>
  );
};

export default MeasureBoard;
