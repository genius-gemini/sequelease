import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import FromClause from './fromClause';
import SelectClause from './selectClause';
import WhereClause from './whereClause';

const OuterGrid = props => {
  const { db, query, updateQueryState } = props;
  return (
    <div>
      <div>
        <div
          style={{
            verticalAlign: 'top',
            marginTop: '10px',
            display: 'inline-block',
          }}
        >
          <Header>FROM</Header>
        </div>
        <div style={{ display: 'inline-block' }}>
          <FromClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </div>
      </div>

      <div>
        <div
          style={{
            verticalAlign: 'top',
            marginTop: '10px',
            display: 'inline-block',
          }}
        >
          <Header>SELECT</Header>
        </div>
        <div style={{ display: 'inline-block' }}>
          <SelectClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </div>
      </div>
      <div>
        <div
          style={{
            verticalAlign: 'top',
            marginTop: '10px',
            display: 'inline-block',
          }}
        >
          <Header>WHERE</Header>
        </div>
        <div style={{ display: 'inline-block' }}>
          <WhereClause
            db={db}
            query={query}
            updateQueryState={updateQueryState}
          />
        </div>
      </div>
    </div>
  );
};

export default OuterGrid;
