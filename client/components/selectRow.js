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

const SelectRow = props => {
  const { rowIndex, query, updateQueryState, db, row } = props;

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
                              type="selectRow"
                              updateQueryState={updateQueryState}
                              rowIndex={rowIndex}
                              query={query}
                            />
                          </Form.Field>
                          <Form.Field>
                            {rowIndex > 0 ? ', ' : null}
                            <SelectAndWhereColumnSearchBar
                              type="select"
                              rowIndex={rowIndex}
                              updateQueryState={updateQueryState}
                              query={query}
                              value={row.name}
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

export default SelectRow;
