import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  customTooltip: {
    background: 'white',
    padding: 1,
  },
  tooltipDetails: {
    marginLeft: 13,
    marginRight: 19,
  },
  label: {
    fontWeight: 600,
  },
});

const CustomTooltip = ({ active, payload }: any) => {
  const classes = useStyles();

  if (active && payload && payload.length) {
    const timeLabel = new Date(payload[0].payload.at).toLocaleString('en-US');
    return (
      <div className={classes.customTooltip}>
        <div className={classes.tooltipDetails}>
          <p>Date: {timeLabel}</p>
          <p className={classes.label}>
            {payload[0].payload.metric}:&nbsp;
            {payload[0].payload.value} PSI
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
