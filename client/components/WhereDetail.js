/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { Component } from 'react';
import OperatorSearchBar from './OperatorSearchBar';
import JoinSearchBar from './JoinSearchBar';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default class WhereDetail extends Component {
  constructor(props) {
    super(props);

    // To blur search boxes on drag
    document.addEventListener('mousedown', e => {
      if (
        [...e.target.classList].includes('drag') &&
        e.target.tagName === 'DIV'
      ) {
        document.activeElement.blur();
      }
    });
  }

  modifyTargetColumn = (fieldSequence, column) => {
    // split on . to determine if table and field in table exists in db
    const tablename = column.split('.')[0];
    const columnName = column.split('.')[1];

    // Search for table in db
    const foundTable = this.props.hrDb.tables.find(table => {
      return table.name === tablename;
    });

    // If table is found, search for column in the table
    let foundColumn = null;
    if (foundTable) {
      foundColumn = foundTable.fields.find(field => {
        return field.name === columnName;
      });
    }

    // If column is found in table, add to where clause with column type, otherwise just add searchbox column text
    this.props.query.where.selectedWhereColumns[fieldSequence] = foundColumn
      ? {
          ...this.props.query.where.selectedWhereColumns[fieldSequence],
          name: column,
          type: foundColumn.type,
        }
      : {
          ...this.props.query.where.selectedWhereColumns[fieldSequence],
          name: column,
        };
    this.props.updateQueryState();
  };

  modifyOperator = (fieldSequence, operator) => {
    // Find if operator exists
    const foundOp = this.props.query.where.operators.find(op => {
      return op.operator === operator;
    });

    // If operator exists, get the hint associated with the operator, else
    // return an empty selected operator
    this.props.query.where.selectedWhereColumns[fieldSequence] = foundOp
      ? {
          ...this.props.query.where.selectedWhereColumns[fieldSequence],
          selectedOperator: { ...foundOp },
          operatorText: operator,
        }
      : {
          ...this.props.query.where.selectedWhereColumns[fieldSequence],
          operatorText: operator,
          selectedOperator: { name: '', hint: null },
        };
    this.props.updateQueryState();
  };

  handleAddClick = fieldSequence => {
    // Add default information for row in where clause
    this.props.query.where.selectedWhereColumns.splice(fieldSequence + 1, 0, {
      name: '',
      type: null,
      selectedOperator: { operator: '', hint: null },
      operatorText: '',
      filter: '',
    });
    this.props.updateQueryState();
  };

  handleRemoveClick = fieldSequence => {
    this.props.query.where.selectedWhereColumns.splice(fieldSequence, 1);
    this.props.updateQueryState();
  };

  handleFilterChange = (value, fieldSequence) => {
    this.props.query.where.selectedWhereColumns[fieldSequence].filter = value;
    this.props.updateQueryState();
  };

  // eslint-disable-next-line complexity
  onDragEnd = result => {
    if (result.destination) {
      let sourceJoin = this.props.query.where.selectedWhereColumns.splice(
        result.source.index,
        1
      )[0];
      this.props.query.where.selectedWhereColumns.splice(
        result.destination.index,
        0,
        sourceJoin
      );

      this.props.updateQueryState();
    }
  };

  render() {
    const { queryState } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppableWhere">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div>
                {queryState.where.selectedWhereColumns.map((field, i) => {
                  return (
                    <Draggable
                      key={`itemW-${i}`}
                      draggableId={`itemW-${i}`}
                      index={i}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div>
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              {i === 0 ? (
                                <div className="drag">
                                  <button
                                    onClick={this.handleAddClick.bind(this, i)}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    +
                                  </button>
                                  {queryState.where.selectedWhereColumns
                                    .length > 1 ? (
                                    <button
                                      onClick={this.handleRemoveClick.bind(
                                        this,
                                        i
                                      )}
                                      type="button"
                                      style={{ marginRight: '10px' }}
                                    >
                                      -
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBar
                                      key={`jsbt3-${i}`}
                                      joinSequence={i}
                                      modifyTargetColumn={
                                        this.modifyTargetColumn
                                      }
                                      columnsToSelect={queryState.where.tables}
                                      selectedColumn={field.name}
                                    />
                                  </div>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    <OperatorSearchBar
                                      key={`osb-${i}`}
                                      modifyOperator={this.modifyOperator}
                                      operatorSequence={i}
                                      operatorsToSelect={
                                        queryState.where.operators
                                      }
                                      selectedOperator={field.selectedOperator}
                                      operatorText={field.operatorText}
                                    />
                                  </div>{' '}
                                  <input
                                    type="text"
                                    value={field.filter}
                                    onChange={e =>
                                      this.handleFilterChange(e.target.value, i)
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="drag">
                                  <button
                                    onClick={this.handleAddClick.bind(this, i)}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={this.handleRemoveClick.bind(
                                      this,
                                      i
                                    )}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    -
                                  </button>
                                  <span>AND</span>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBar
                                      key={`jsbt3-${i}`}
                                      joinSequence={i}
                                      modifyTargetColumn={
                                        this.modifyTargetColumn
                                      }
                                      columnsToSelect={queryState.select.tables}
                                      selectedColumn={field.name}
                                    />
                                  </div>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    <OperatorSearchBar
                                      key={`osb-${i}`}
                                      modifyOperator={this.modifyOperator}
                                      operatorSequence={i}
                                      operatorsToSelect={
                                        queryState.where.operators
                                      }
                                      selectedOperator={field.selectedOperator}
                                      operatorText={field.operatorText}
                                    />
                                  </div>{' '}
                                  <input
                                    type="text"
                                    value={field.filter}
                                    onChange={e =>
                                      this.handleFilterChange(e.target.value, i)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
