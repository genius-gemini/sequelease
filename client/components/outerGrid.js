import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import FromClause from './fromClause';
import SelectClause from './selectClause';
import WhereClause from './whereClause';

const OuterGrid = props => {
  const { db, query, updateQueryState } = props;
  return (
    <Grid celled>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>FROM</Header>
        </Grid.Column>
        <Grid.Column width={12}>
          <FromClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>SELECT</Header>
        </Grid.Column>
        <Grid.Column width={12}>
          <SelectClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>WHERE</Header>
        </Grid.Column>
        <Grid.Column width={12}>
          <WhereClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default OuterGrid;
