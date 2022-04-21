import React, { FC, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import Select, { MultiValue } from 'react-select';
import Chip from '../../components/Chip';
import Graph from './Graph';
import MeasureBoard from './MeasureBoard';

const client = new ApolloClient({
  uri: 'https://react-assessment.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

const presentTime = new Date().valueOf();
const pastTime = 30 * 60000;

const query = gql`
  query {
    getMetrics
  }
`;

type SelectValue = {
  value: string;
  label: string;
};

const SelectBox: FC = () => {
  const [selectOption, setSelectOption] = useState<SelectValue[]>([]);
  const { loading, error, data } = useQuery(query);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Metric name not found" />;

  const metricName = data.getMetrics;

  const handleSelectionChange = (newSelections: MultiValue<SelectValue>) => {
    setSelectOption([...newSelections]);
  };

  const input = [];
  for (let i = 0; i < selectOption.length; i += 1) {
    input.push({
      metricName: selectOption[i].value,
      after: presentTime - pastTime,
      before: presentTime,
    });
  }

  return (
    <div style={{ margin: '3em' }}>
      <Select
        isMulti
        onChange={handleSelectionChange}
        options={metricName.map((name: string) => ({ label: name, value: name }))}
      />
      {
        selectOption.length === 0 ? (
          <div>&nbsp;</div>
        ) : (
          <div>
            {input.map((item: any) => (
              <MeasureBoard key={item} payload={item.metricName} />
            ))}
            <Graph payload={input} />
          </div>
        )
      }
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <SelectBox />
  </ApolloProvider>
);
