/* eslint-disable */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const MeasurementInfo = () => {
  const classes = useStyles();
  const [metric, setMetric] = useState({ metric: '', unit: '', value: '' });
  // const filterByMetric = [props.liveData].find((m: any) => m.metric === props.info.value);
  // const newValue = filterByMetric !== undefined ? filterByMetric : metric;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.pos} color="textSecondary">
          {`${metric.value} - ${metric.unit}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeasurementInfo;
