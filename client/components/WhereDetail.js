/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { Component } from 'react';
import OperatorSearchBar from './OperatorSearchBar';
import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';
import { Draggable } from 'react-beautiful-dnd';
import withQueryDetail from '../hocs/withQueryDetail';

class WhereDetail extends Component {
  componentDidMount() {
    this.props.setClause(this.props.query.where);
  }

  modifyWhereColumn = (rowIndex, alias, tableName, value) => {
    this.props.query.where.modifyWhereColumn(rowIndex, alias, tableName, value);

    this.props.updateQueryState();
  };

  modifyOperator = (rowIndex, operator) => {
    this.props.query.where.modifyOperator(rowIndex, operator);
    this.props.updateQueryState();
  };

  handleAddClick = rowIndex => {
    // Add default information for row in where clause
    this.props.query.where.handleAddClick(rowIndex);
    this.props.updateQueryState();
  };

  handleRemoveClick = rowIndex => {
    this.props.query.where.handleRemoveClick(rowIndex);
    this.props.updateQueryState();
  };

  handleFilterChange = (value, rowIndex) => {
    this.props.query.where.handleFilterChange(value, rowIndex);
    this.props.updateQueryState();
  };

  render() {
    const { query } = this.props;
    return (
      <div>
        {query.where.whereRows.map((row, i) => {
          return (
            <Draggable key={`itemW-${i}`} draggableId={`itemW-${i}`} index={i}>
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
                          onClick={this.handleAddClick.bind(this, i)}
                          type="button"
                          style={{ marginRight: '10px' }}
                        >
                          +
                        </button>
                        {query.where.whereRows.length > 1 ? (
                          <button
                            onClick={this.handleRemoveClick.bind(this, i)}
                            type="button"
                            style={{ marginRight: '10px' }}
                          >
                            -
                          </button>
                        ) : (
                          ''
                        )}
                        {i > 0 ? <span>AND </span> : ''}
                        <div style={{ display: 'inline-block' }}>
                          <SelectAndWhereColumnSearchBar
                            key={`jsbt3-${i}`}
                            rowIndex={i}
                            modifyColumn={this.modifyWhereColumn}
                            fullResults={query.fullResults.results}
                            value={row.name}
                          />
                        </div>{' '}
                        <div style={{ display: 'inline-block' }}>
                          <OperatorSearchBar
                            key={`osb-${i}`}
                            modifyOperator={this.modifyOperator}
                            operatorSequence={i}
                            operatorsToSelect={query.where.operators}
                            selectedOperator={row.selectedOperator}
                            operatorText={row.operatorText}
                          />
                        </div>{' '}
                        <input
                          type="text"
                          value={row.filter}
                          onChange={e =>
                            this.handleFilterChange(e.target.value, i)
                          }
                        />
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

export default withQueryDetail(WhereDetail);
