import React, { Component } from 'react';
import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';
import withQueryDetail from '../hocs/QueryDetail';
import { Draggable } from 'react-beautiful-dnd';

class SelectDetail extends Component {
  componentDidMount() {
    this.props.setClause(this.props.query.select);
  }

  modifySelectColumn = (rowIndex, alias, tableName, value) => {
    this.props.query.select.modifySelectColumn(
      rowIndex,
      alias,
      tableName,
      value
    );
    this.props.updateQueryState();
  };

  handleAddClick = rowIndex => {
    this.props.query.select.handleAddClick(rowIndex);
    this.props.updateQueryState();
  };

  handleRemoveClick = rowIndex => {
    this.props.query.select.handleRemoveClick(rowIndex);
    this.props.updateQueryState();
  };

  render() {
    const { query } = this.props;
    return (
      <div>
        {query.select.selectRows.map((row, i) => {
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
                          onClick={this.handleAddClick.bind(this, i)}
                          type="button"
                          style={{ marginRight: '10px' }}
                        >
                          +
                        </button>
                        {query.select.selectRows.length > 1 ? (
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
                        {i > 0 ? <span>, </span> : ''}
                        <div style={{ display: 'inline-block' }}>
                          <SelectAndWhereColumnSearchBar
                            key={`jsbt2-${i}`}
                            rowIndex={i}
                            modifyColumn={this.modifySelectColumn}
                            fullResults={query.fullResults.results}
                            value={row.name}
                          />
                        </div>
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

export default withQueryDetail(SelectDetail);
