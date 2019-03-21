import React, { Component } from 'react';
import TableSearchBar from './TableSearchBar';
import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';
import withQueryDetail from '../hocs/QueryDetail';
import { Draggable } from 'react-beautiful-dnd';

class FromDetail extends Component {
  componentDidMount() {
    this.props.setClause(this.props.query.from);
  }

  modifyFromRowTable = (rowIndex, tableName) => {
    this.props.query.from.modifyFromRowTable(rowIndex, tableName);
    this.props.updateQueryState();
  };

  modifyRowTableJoinColumn = (
    rowIndex,
    joinColumnIndex,
    alias,
    tableName,
    column
  ) => {
    this.props.query.from.modifyRowTableJoinColumn(
      rowIndex,
      joinColumnIndex,
      alias,
      tableName,
      column
    );
    this.props.updateQueryState();
  };

  modifyPreviousTableJoinColumn = (
    rowIndex,
    joinColumnIndex,
    alias,
    tableName,
    column
  ) => {
    this.props.query.from.modifyPreviousTableJoinColumn(
      rowIndex,
      joinColumnIndex,
      alias,
      tableName,
      column
    );
    this.props.updateQueryState();
  };

  handleAddJoinRowClick = rowIndex => {
    this.props.query.from.handleAddJoinRowClick(rowIndex);

    this.props.updateQueryState();
  };

  handleRemoveJoinRowClick = rowIndex => {
    this.props.query.from.handleRemoveJoinRowClick(rowIndex);

    //this.validate();
    this.props.updateQueryState();
  };

  handleAddConditionClick(rowIndex) {
    this.props.query.from.handleAddJoinConditionClick(rowIndex);

    this.props.updateQueryState();
  }

  handleRemoveConditionClick(rowIndex) {
    this.props.query.from.handleRemoveJoinConditionClick(rowIndex);

    this.props.updateQueryState();
  }
  /*
  validate() {
    for (let i = 0; i < this.props.query.from.rows.length; i++) {
      // Table validation
      if (
        !this.props.query.from.resultTables.includes(
          this.props.query.from.rows[i].tableText.trim()
        ) &&
        this.props.query.from.rows[i].tableText.trim()
      ) {
        this.props.query.from.rows[i].tableError = 'Invalid table';
      } else {
        this.props.query.from.rows[i].tableError = '';
      }

      // Row Table Join Column
      for (
        let j = 0;
        j < this.props.query.from.rows[i].joinColumns.length;
        j++
      ) {
        let tableAliasAndColumn = this.props.query.from.rows[i].joinColumns[
          j
        ].rowTableJoinColumn.name.split('.');
        let tableAlias = tableAliasAndColumn[0];
        if (
          this.props.query.from.rows[i].joinColumns[
            j
          ].rowTableJoinColumn.name.trim()
        ) {
          if (tableAliasAndColumn.length <= 1) {
            this.props.query.from.rows[i].joinColumns[
              j
            ].rowTableJoinColumn.error = `Need table alias (${tableAlias})`;
          } else if (tableAlias !== this.props.query.from.rows[i].tableAlias) {
            this.props.query.from.rows[i].joinColumns[
              j
            ].rowTableJoinColumn.error = `Table alias does not match ${
              this.props.query.from.rows[i].tableAlias
            }`;
          } else {
            this.props.query.from.rows[i].joinColumns[
              j
            ].rowTableJoinColumn.error = '';
          }
        }

        tableAliasAndColumn = this.props.query.from.rows[i].joinColumns[
          j
        ].previousTableJoinColumn.name.split('.');
        tableAlias = tableAliasAndColumn[0];
        if (
          this.props.query.from.rows[i].joinColumns[
            j
          ].previousTableJoinColumn.name.trim()
        ) {
          if (
            !this.props.query.from.rows[i].previousTablesJoinColumns.map(
              previousTable => previousTable.tableAlias
            ).length
          ) {
            this.props.query.from.rows[i].joinColumns[
              j
            ].previousTableJoinColumn.error = 'No valid table to join to';
          } else if (tableAliasAndColumn.length <= 1) {
            this.props.query.from.rows[i].joinColumns[
              j
            ].previousTableJoinColumn.error = `Need table alias from prior table (${this.props.query.from.rows[
              i
            ].previousTablesJoinColumns
              .map(previousTable => previousTable.tableAlias)
              .join(', ')})`;
          } else if (
            !this.props.query.from.rows[i].previousTablesJoinColumns
              .map(previousTable => previousTable.tableAlias)
              .includes(tableAlias)
          ) {
            this.props.query.from.rows[i].joinColumns[
              j
            ].previousTableJoinColumn.error = `Table alias does not match any prior table's alias (${this.props.query.from.rows[
              i
            ].previousTablesJoinColumns
              .map(previousTable => previousTable.tableAlias)
              .join(', ')})`;
          } else {
            this.props.query.from.rows[i].joinColumns[
              j
            ].previousTableJoinColumn.error = '';
          }
        }
      }
    }
  }
  */

  render() {
    const { query, db } = this.props;
    return (
      <div>
        {query.from.fromJoinRows.map((row, i) => {
          return (
            <Draggable key={`itemS-${i}`} draggableId={`itemS-${i}`} index={i}>
              {(provided, snapshot) => {
                return (
                  <div>
                    <div
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <div className="drag">
                        <button
                          onClick={this.handleAddJoinRowClick.bind(this, i)}
                          type="button"
                          style={{ marginRight: '10px' }}
                        >
                          +
                        </button>
                        {query.from.fromJoinRows.length > 1 ? (
                          <button
                            onClick={this.handleRemoveJoinRowClick.bind(
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
                        {i > 0 ? (
                          <select name="join">
                            <option value="INNER JOIN">INNER JOIN</option>
                            <option value="LEFT OUTER JOIN">
                              LEFT OUTER JOIN
                            </option>
                          </select>
                        ) : (
                          ''
                        )}
                        <div style={{ display: 'inline-block' }}>
                          <TableSearchBar
                            key={`tsb-${i}`}
                            modifyFromRowTable={this.modifyFromRowTable}
                            rowIndex={i}
                            resultTables={db.getTableNames}
                            table={row.tableMetadata.name}
                            tableText={row.tableText}
                          />
                        </div>{' '}
                        <span>AS {row.tableAlias}</span>{' '}
                        {i > 0 ? (
                          <div style={{ display: 'inline-block' }}>
                            <span>ON</span>
                            <div style={{ display: 'inline-block' }}>
                              {row.joinColumns.map((joinColumn, j) => (
                                <div
                                  style={{ display: 'inline-block' }}
                                  key={`jc-${i}-${j}`}
                                >
                                  {j > 0 ? <span>&nbsp;AND </span> : ''}
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBarSource
                                      key={`jsbs-${i}`}
                                      rowIndex={i}
                                      joinColumnIndex={j}
                                      modifyRowTableJoinColumn={
                                        this.modifyRowTableJoinColumn
                                      }
                                      table={row.tableMetadata}
                                      tableAlias={row.tableAlias}
                                      columnText={
                                        joinColumn.rowTableJoinColumn.name
                                      }
                                    />
                                  </div>
                                  <span> = </span>
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBar
                                      key={`jsbt-${i}`}
                                      rowIndex={i}
                                      joinColumnIndex={j}
                                      modifyPreviousTableJoinColumn={
                                        this.modifyPreviousTableJoinColumn
                                      }
                                      previousTablesJoinColumns={
                                        row.previousTablesJoinColumns
                                      }
                                      previousTableJoinColumn={
                                        joinColumn.previousTableJoinColumn.name
                                      }
                                    />
                                  </div>
                                </div>
                              ))}{' '}
                              <button
                                onClick={this.handleAddConditionClick.bind(
                                  this,
                                  i
                                )}
                                type="button"
                                style={{ marginRight: '10px' }}
                              >
                                +
                              </button>
                              {row.joinColumns.length > 1 ? (
                                <button
                                  onClick={this.handleRemoveConditionClick.bind(
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
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    {provided.placeholder}
                  </div>
                );
              }}
            </Draggable>
          );
        })}
      </div>
    );
  }
}

export default withQueryDetail(FromDetail);
