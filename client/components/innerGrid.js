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
import JoinPopup from './joinPopup';
import TableSearchBar from './TableSearchBar';

import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';
const InnerGrid = props => {
  const {
    rowIndex,
    query,
    handleAddJoinRowClick,
    updateQueryState,
    db,
    row,
  } = props;

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
              <Grid className="drag" columns={2} celled>
                <Grid.Row style={{ padding: '7px' }}>
                  <Grid.Column style={{ width: '600px', height: '38px' }}>
                    <Form>
                      <Form.Group inline>
                        <Form.Field>
                          <Buttons
                            type="fromJoinRow"
                            updateQueryState={updateQueryState}
                            rowIndex={rowIndex}
                            query={query}
                          />
                        </Form.Field>
                        {rowIndex > 0 ? (
                          <Form.Field>
                            <JoinPopup
                              updateQueryState={updateQueryState}
                              rowIndex={rowIndex}
                              query={query}
                            />
                          </Form.Field>
                        ) : null}
                        <Form.Field>
                          <TableSearchBar
                            rowIndex={rowIndex}
                            resultTables={db.getTableNames}
                            table={row.tableMetadata.name}
                            tableText={row.tableText}
                            updateQueryState={updateQueryState}
                            query={query}
                          />
                          <label>AS {row.tableAlias}</label>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                  {rowIndex > 0 ? (
                    <Grid.Column style={{ width: '500px', height: '38px' }}>
                      <Form>
                        <Form.Group inline>
                          <Form.Field>
                            <label>ON</label>
                          </Form.Field>
                          {row.joinColumns.map((col, colIndex) => (
                            <Form.Group key={`jcs${rowIndex}-${colIndex}`}>
                              {colIndex > 0 ? <label> AND </label> : null}
                              <Form.Field>
                                <JoinSearchBarSource
                                  rowIndex={rowIndex}
                                  joinColumnIndex={colIndex}
                                  table={row.tableMetadata}
                                  tableAlias={row.tableAlias}
                                  columnText={col.rowTableJoinColumn.name}
                                  query={query}
                                  updateQueryState={updateQueryState}
                                />
                              </Form.Field>
                              <Form.Field>
                                <label>=</label>
                              </Form.Field>
                              <Form.Field>
                                <JoinSearchBar
                                  rowIndex={rowIndex}
                                  joinColumnIndex={colIndex}
                                  previousTablesJoinColumns={
                                    row.previousTablesJoinColumns
                                  }
                                  previousTableJoinColumn={
                                    col.previousTableJoinColumn.name
                                  }
                                  query={query}
                                  updateQueryState={updateQueryState}
                                />
                              </Form.Field>
                              <Form.Field>
                                <Buttons
                                  type="joinCondition"
                                  updateQueryState={updateQueryState}
                                  rowIndex={rowIndex}
                                  query={query}
                                />
                              </Form.Field>
                            </Form.Group>
                          ))}
                        </Form.Group>
                      </Form>
                    </Grid.Column>
                  ) : null}
                </Grid.Row>
              </Grid>
            </div>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
};

export default InnerGrid;

// const Buttons = props => (
//   //   <Button.Group basic size="small">
//   <div>
//     <Button
//     onClick={console.log('plus button pressed')}
//     circular color="green" icon="plus" size="tiny" />
//     <Button circular color="red" icon="trash" size="tiny" />
//   </div>
//   //   </Button.Group>
// );
