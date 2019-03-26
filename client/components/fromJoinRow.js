import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Grid,
  Popup,
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

class FromJoinRow extends Component {
  componentDidMount = () => {
    [
      ...document.querySelectorAll('[data-react-beautiful-dnd-drag-handle]'),
    ].map(elem => elem.removeAttribute('tabindex'));
  };

  render() {
    const { rowIndex, query, updateQueryState, db, row } = this.props;

    return (
      <Draggable
        key={`itemF-${rowIndex}`}
        draggableId={`itemF-${rowIndex}`}
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
                  <Grid columns={2} celled>
                    <Grid.Row>
                      <Grid.Column width={8}>
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
                                tableTextText={row.tableTextText}
                                tableTextInitial={row.tableTextInitial}
                                tableTextError={row.tableTextError}
                                updateQueryState={updateQueryState}
                                query={query}
                              />
                              <label>AS {row.tableAlias}</label>
                            </Form.Field>
                          </Form.Group>
                        </Form>
                      </Grid.Column>
                      {rowIndex > 0 ? (
                        <Grid.Column column={12}>
                          <Form>
                            <Form.Group inline>
                              <Form.Field>
                                <label>ON</label>
                              </Form.Field>
                              {row.joinColumns.map((col, colIndex) => (
                                <div
                                  style={{ margin: 0 }}
                                  key={`jc-${rowIndex}-${colIndex}`}
                                >
                                  {colIndex > 0 ? <label> AND </label> : null}
                                  <Form.Field>
                                    <JoinSearchBarSource
                                      rowIndex={rowIndex}
                                      joinColumnIndex={colIndex}
                                      table={row.tableMetadata}
                                      tableAlias={row.tableAlias}
                                      columnText={col.rowTableJoinColumn.name}
                                      error={col.rowTableJoinColumn.error}
                                      initial={col.rowTableJoinColumn.initial}
                                      text={col.rowTableJoinColumn.text}
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
                                      text={col.previousTableJoinColumn.text}
                                      previousTablesJoinColumns={
                                        row.previousTablesJoinColumns
                                      }
                                      previousTableJoinColumn={
                                        col.previousTableJoinColumn.name
                                      }
                                      error={col.previousTableJoinColumn.error}
                                      initial={
                                        col.previousTableJoinColumn.initial
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
                                </div>
                              ))}
                            </Form.Group>
                          </Form>
                        </Grid.Column>
                      ) : null}
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
  }
}

export default FromJoinRow;

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
