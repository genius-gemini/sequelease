/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { Component } from 'react';
import TableSearchBar from './TableSearchBar';
import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

class FromDetail extends Component {
  // eslint-disable-next-line complexity

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

  modifyTable = (joinSequence, tableName) => {
    // Change table text in search bar
    this.props.query.from.selectedTables[joinSequence].tableText = tableName;

    // See if table name text is actually a table
    const table = this.props.hrDb.tables.find(
      newTable => newTable.name === tableName
    );

    if (table) {
      // Set table in select clause for results
      this.props.query.select.tables.push(table);

      // Set table
      this.props.query.from.selectedTables[joinSequence].table = table;

      // eslint-disable-next-line guard-for-in
      // Get table join conditions
      for (let otherTable of this.props.query.from.selectedTables.slice(
        joinSequence + 1
      )) {
        let newJoinTable = otherTable.targetJoinColumns.find(
          joinTable => joinTable.name === tableName
        );

        if (!newJoinTable) {
          otherTable.targetJoinColumns.push(table);
        }
      }
    } else {
      this.props.query.from.selectedTables[joinSequence].table = {};

      this.props.query.from.selectedTables[joinSequence].sourceJoinColumn = '';

      for (
        let i = joinSequence;
        i < this.props.query.from.selectedTables.length;
        i++
      ) {
        let otherTable = this.props.query.from.selectedTables[i];
        otherTable.targetJoinColumns = [];
        for (let j = 0; j < i; j++) {
          let prevTable = this.props.query.from.selectedTables[j];
          otherTable.targetJoinColumns.push(prevTable.table);
        }

        let targetColumnName = otherTable.targetJoinColumn.split('.');
        if (targetColumnName.length === 2) {
          if (
            !otherTable.targetJoinColumns
              .map(targetJoinColumnsTable => targetJoinColumnsTable.name)
              .includes(targetColumnName[0])
          ) {
            otherTable.targetJoinColumn = '';
          }
        }
      }

      const existingTable = this.props.query.select.tables.find(
        newTable => newTable.name === tableName
      );

      if (!existingTable) {
        console.log('here');
        this.props.query.select.tables = [];
        for (let i = 0; i < this.props.query.from.selectedTables.length; i++) {
          if (
            Object.keys(this.props.query.from.selectedTables[i].table).length
          ) {
            this.props.query.select.tables.push(
              this.props.query.from.selectedTables[i].table
            );
          }
        }

        this.props.query.select.selectedColumns = this.props.query.select.selectedColumns.filter(
          column => {
            return (
              !column ||
              (column &&
                this.props.query.select.tables
                  .map(searchTable => searchTable.name)
                  .includes(column.split('.')[0]))
            );
          }
        );
        if (!this.props.query.select.selectedColumns.length)
          this.props.query.select.selectedColumns.push('');
      }
    }
    this.props.updateQueryState();
    console.log(this.props.query);
  };

  modifySourceColumn = (joinSequence, column) => {
    this.props.query.from.selectedTables[
      joinSequence
    ].sourceJoinColumn = column;
    this.props.updateQueryState();
  };

  modifyTargetColumn = (joinSequence, column) => {
    this.props.query.from.selectedTables[
      joinSequence
    ].targetJoinColumn = column;
    this.props.updateQueryState();
  };

  handleAddClick = joinSequence => {
    this.props.query.from.selectedTables.splice(joinSequence + 1, 0, {
      ...this.props.fromJoinDefault,
    });

    this.props.query.from.selectedTables[
      joinSequence + 1
    ].targetJoinColumns = [];
    for (let prevTable of this.props.query.from.selectedTables.slice(
      0,
      joinSequence + 1
    )) {
      if (Object.keys(prevTable.table).length) {
        this.props.query.from.selectedTables[
          joinSequence + 1
        ].targetJoinColumns.push(prevTable.table);
      }
    }

    this.props.updateQueryState();
  };

  handleRemoveClick = joinSequence => {
    this.props.query.from.selectedTables.splice(joinSequence, 1);

    for (
      let i = joinSequence;
      i < this.props.query.from.selectedTables.length;
      i++
    ) {
      let otherTable = this.props.query.from.selectedTables[i];
      otherTable.targetJoinColumns = [];
      for (let j = 0; j < i; j++) {
        let prevTable = this.props.query.from.selectedTables[j];
        if (Object.keys(prevTable.table).length) {
          otherTable.targetJoinColumns.push(prevTable.table);
        }
      }

      let targetColumnName = otherTable.targetJoinColumn.split('.');
      if (targetColumnName.length === 2) {
        if (
          !otherTable.targetJoinColumns
            .map(targetJoinColumnsTable => targetJoinColumnsTable.name)
            .includes(targetColumnName[0])
        ) {
          otherTable.targetJoinColumn = '';
        }
      }
    }

    this.props.updateQueryState();
    console.log(this.props.query.from);
  };

  // eslint-disable-next-line complexity
  onDragEnd = result => {
    if (result.destination) {
      let sourceJoin = this.props.query.from.selectedTables.splice(
        result.source.index,
        1
      )[0];
      this.props.query.from.selectedTables.splice(
        result.destination.index,
        0,
        sourceJoin
      );

      let startIndex =
        result.destination.index < result.source.index
          ? result.destination.index
          : result.source.index;

      let endIndex =
        result.destination.index < result.source.index
          ? result.source.index
          : result.destination.index;

      for (let i = startIndex; i <= endIndex; i++) {
        let otherTable = this.props.query.from.selectedTables[i];
        otherTable.targetJoinColumns = [];
        for (let j = 0; j < i; j++) {
          let prevTable = this.props.query.from.selectedTables[j];
          if (Object.keys(prevTable.table).length) {
            otherTable.targetJoinColumns.push(prevTable.table);
          }
        }

        let targetColumnName = otherTable.targetJoinColumn.split('.');
        if (targetColumnName.length === 2) {
          if (
            !otherTable.targetJoinColumns
              .map(targetJoinColumnsTable => targetJoinColumnsTable.name)
              .includes(targetColumnName[0])
          ) {
            otherTable.targetJoinColumn = '';
          }
        }
      }
      console.log(this.props.query.from);
      this.props.updateQueryState();
    }
  };

  render() {
    const { queryState } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div>
                {queryState.from.selectedTables.map((row, i) => {
                  return (
                    <Draggable key={i} draggableId={`item-${i}`} index={i}>
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
                                  {queryState.from.selectedTables.length > 1 ? (
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
                                    <TableSearchBar
                                      key={`tsb-${i}`}
                                      modifyTable={this.modifyTable}
                                      joinSequence={i}
                                      tablesToSelect={
                                        queryState.from.tablesToSelect
                                      }
                                      selectedTable={row.table.name}
                                      selectedTableText={row.tableText}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="drag" key={`tsbd-${i}`}>
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
                                  <select name="join">
                                    <option value="INNER JOIN">
                                      INNER JOIN
                                    </option>
                                    <option value="LEFT OUTER JOIN">
                                      LEFT OUTER JOIN
                                    </option>
                                  </select>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    <TableSearchBar
                                      key={`tsb-${i}`}
                                      modifyTable={this.modifyTable}
                                      joinSequence={i}
                                      tablesToSelect={
                                        queryState.from.tablesToSelect
                                      }
                                      selectedTable={row.table.name}
                                      selectedTableText={row.tableText}
                                    />
                                  </div>{' '}
                                  <span>ON</span>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBarSource
                                      key={`jsbs-${i}`}
                                      joinSequence={i}
                                      modifySourceColumn={
                                        this.modifySourceColumn
                                      }
                                      selectedTable={row.table}
                                      selectedColumn={row.sourceJoinColumn}
                                    />
                                  </div>{' '}
                                  <span>=</span>{' '}
                                  <div style={{ display: 'inline-block' }}>
                                    {
                                      <JoinSearchBar
                                        key={`jsbt-${i}`}
                                        joinSequence={i}
                                        modifyTargetColumn={
                                          this.modifyTargetColumn
                                        }
                                        columnsToSelect={row.targetJoinColumns}
                                        selectedColumn={row.targetJoinColumn}
                                      />
                                    }
                                  </div>
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

export default FromDetail;
