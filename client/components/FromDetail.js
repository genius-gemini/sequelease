/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { Component } from 'react';
import TableSearchBar from './TableSearchBar';
import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';
import JoinDropdown from './JoinDropdown'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const alias = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
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

  modifyTable = (joinSequence, tablename) => {
    // Change table text in search bar
    this.props.query.from.selectedTables[joinSequence].tableText = tablename;

    // See if table name text is actually a table
    const table = this.props.hrDb.tables.find(
      newTable => newTable.name === tablename
    );

    if (table) {
      // Set table in select clause for results
      this.props.query.select.tables.push(table);

      // Set table in where clause for results
      this.props.query.where.tables.push(table);

      // Set table in from clause
      this.props.query.from.selectedTables[joinSequence].table = table;

      // eslint-disable-next-line guard-for-in
      // Add new table to results of subsequent joined tables
      for (let otherTable of this.props.query.from.selectedTables.slice(
        joinSequence + 1
      )) {
        let newJoinTable = otherTable.targetJoinColumns.find(
          joinTable => joinTable.name === tablename
        );

        if (!newJoinTable) {
          otherTable.targetJoinColumns.push(table);
        }
      }
    } else {
      // Remove table from from clause
      this.props.query.from.selectedTables[joinSequence].table = {};

      // Clear out source join column
      this.props.query.from.selectedTables[joinSequence].sourceJoinColumn = {
        name: '',
        type: null,
      };

      // Rebuild all subsequent joined tables' results
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

        let targetColumnName =
          (otherTable.targetJoinColumn.name &&
            otherTable.targetJoinColumn.name.split('.')) ||
          [];
        if (targetColumnName.length === 2) {
          if (
            !otherTable.targetJoinColumns
              .map(targetJoinColumnsTable => targetJoinColumnsTable.name)
              .includes(targetColumnName[0])
          ) {
            otherTable.targetJoinColumn = { name: '', type: null };
          }
        }
      }

      const existingTable = this.props.query.select.tables.find(
        newTable => newTable.name === tablename
      );

      // Rebuild results for select and where columns
      if (!existingTable) {
        this.props.query.select.tables = [];
        this.props.query.where.tables = [];
        for (let i = 0; i < this.props.query.from.selectedTables.length; i++) {
          if (
            Object.keys(this.props.query.from.selectedTables[i].table).length
          ) {
            this.props.query.select.tables.push(
              this.props.query.from.selectedTables[i].table
            );
            this.props.query.where.tables.push(
              this.props.query.from.selectedTables[i].table
            );
          }
        }

        // Delete select columns with table that does not exist
        this.props.query.select.selectedColumns = this.props.query.select.selectedColumns.filter(
          column => {
            return (
              !column.name ||
              (column.name &&
                this.props.query.select.tables
                  .map(searchTable => searchTable.name)
                  .includes(column.name.split('.')[0]))
            );
          }
        );
        if (!this.props.query.select.selectedColumns.length)
          this.props.query.select.selectedColumns.push({
            name: '',
            type: null,
          });

        // Delete where columns with table that does not exist
        this.props.query.where.selectedWhereColumns = this.props.query.where.selectedWhereColumns.filter(
          column => {
            return (
              !column.name ||
              (column.name &&
                this.props.query.where.tables
                  .map(searchTable => searchTable.name)
                  .includes(column.name.split('.')[0]))
            );
          }
        );
        if (!this.props.query.where.selectedWhereColumns.length)
          this.props.query.where.selectedWhereColumns.push({
            name: '',
            type: null,
            selectedOperator: { operator: '', hint: null },
            operatorText: '',
            filter: '',
          });
      }
    }
    this.props.updateQueryState();
  };

  modifySourceColumn = (joinSequence, column) => {
    if (column) {
      const tablename = column.split('.')[0];
      const columnName = column.split('.')[1];

      const foundTable = this.props.hrDb.tables.find(table => {
        return table.name === tablename;
      });

      let foundColumn = null;
      if (foundTable) {
        foundColumn = foundTable.fields.find(field => {
          return field.name === columnName;
        });
      }

      this.props.query.from.selectedTables[joinSequence].sourceJoinColumn = {
        name: column,
        type: foundColumn ? foundColumn.type : null,
      } || { name: column, type: null };

      this.props.updateQueryState();
    }
  };

  modifyTargetColumn = (joinSequence, column) => {
    const tablename = column.split('.')[0];
    const columnName = column.split('.')[1];

    const foundTable = this.props.hrDb.tables.find(table => {
      return table.name === tablename;
    });

    let foundColumn = null;
    if (foundTable) {
      foundColumn = foundTable.fields.find(field => {
        return field.name === columnName;
      });
    }

    this.props.query.from.selectedTables[joinSequence].targetJoinColumn = {
      name: column,
      type: foundColumn ? foundColumn.type : null,
    } || { name: column, type: null };

    this.props.updateQueryState();
  };

  handleAddClick = joinSequence => {
    this.props.query.from.selectedTables.splice(joinSequence + 1, 0, {
      ...this.props.fromJoinDefault,
    });

    this.props.query.from.selectedTables[joinSequence + 1].alias =
      alias[joinSequence + 1];

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
      this.props.query.from.selectedTables[i].alias = alias[i];
      otherTable.targetJoinColumns = [];
      for (let j = 0; j < i; j++) {
        let prevTable = this.props.query.from.selectedTables[j];
        if (Object.keys(prevTable.table).length) {
          otherTable.targetJoinColumns.push(prevTable.table);
        }
      }

      let targetColumnName = otherTable.targetJoinColumn.name.split('.');
      if (targetColumnName.length === 2) {
        if (
          !otherTable.targetJoinColumns
            .map(targetJoinColumnsTable => targetJoinColumnsTable.table.name)
            .includes(targetColumnName[0])
        ) {
          otherTable.targetJoinColumn = { name: '', type: null };
        }
      }
    }

    this.props.updateQueryState();
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

        let targetColumnName = otherTable.targetJoinColumn.name.split('.');
        if (targetColumnName.length === 2) {
          if (
            !otherTable.targetJoinColumns
              .map(targetJoinColumnsTable => targetJoinColumnsTable.name)
              .includes(targetColumnName[0])
          ) {
            otherTable.targetJoinColumn = { name: '', type: null };
          }
        }
      }

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
                                  <span id="join-dropdown"><JoinDropdown /></span>{' '}
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
                                      alias={row.alias}
                                      selectedColumn={row.sourceJoinColumn.name}
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
                                        selectedColumn={
                                          row.targetJoinColumn.name
                                        }
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
