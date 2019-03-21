import React from "react";
import { Grid, Header } from "semantic-ui-react";
import FromClause from "./fromClause";

const OuterGrid = props => {
  const { db, query, updateQueryState } = props;
  return (
    <Grid celled>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>FROM</Header>
        </Grid.Column>
        <FromClause query={query} updateQueryState={updateQueryState} />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>SELECT</Header>
        </Grid.Column>

        <Grid.Column width={12} />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={1}>
          <Header>WHERE</Header>
        </Grid.Column>

        <Grid.Column width={12} />
      </Grid.Row>
    </Grid>
  );
};

export default OuterGrid;
