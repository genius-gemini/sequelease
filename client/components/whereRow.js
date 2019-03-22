import React from 'react';
import {
  Form,
  Input,
  Button,
  Grid,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react';

import { Draggable } from 'react-beautiful-dnd';
import Buttons from './buttons';

import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';

import OperatorSearchBar from './OperatorSearchBar';

const WhereRow = props => {
  const { rowIndex, query, updateQueryState, db, row } = props;

  const handleFilterChange = value => {
    query.where.handleFilterChange(value, rowIndex);

    updateQueryState();
  };

  return (
    <Draggable
      key={`itemS-${rowIndex}`}
      draggableId={`itemS-${rowIndex}`}
      index={rowIndex}
    >
      {(provided, snapshot) => {
        return (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              <div className="drag" style={{ width: '1400px' }}>
                <Grid celled>
                  <Grid.Row>
                    <Grid.Column>
                      <Form>
                        <Form.Group inline>
                          <Form.Field>
                            <Buttons
                              type="whereRow"
                              updateQueryState={updateQueryState}
                              rowIndex={rowIndex}
                              query={query}
                            />
                          </Form.Field>

                          <Form.Field>
                            {rowIndex > 0 ? 'AND ' : null}
                            <SelectAndWhereColumnSearchBar
                              type="where"
                              rowIndex={rowIndex}
                              updateQueryState={updateQueryState}
                              query={query}
                              value={row.name}
                            />
                          </Form.Field>
                          <Form.Field>
                            <OperatorSearchBar
                              rowIndex={rowIndex}
                              updateQueryState={updateQueryState}
                              query={query}
                              operatorText={row.operatorText}
                            />
                          </Form.Field>
                          <Form.Field>
                            <input
                              type="text"
                              onChange={e => handleFilterChange(e.target.value)}
                              value={query.where.whereRows[rowIndex].filter}
                            />
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </div>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
};

export default WhereRow;
