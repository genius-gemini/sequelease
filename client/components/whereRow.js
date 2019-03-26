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

import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';

import OperatorSearchBar from './OperatorSearchBar';

class WhereRow extends Component {
  componentDidMount = () => {
    [
      ...document.querySelectorAll('[data-react-beautiful-dnd-drag-handle]'),
    ].map(elem => elem.removeAttribute('tabindex'));
  };

  handleFilterChange = value => {
    const { rowIndex, query, updateQueryState } = this.props;
    query.where.handleFilterChange(value, rowIndex);

    updateQueryState();
  };

  render() {
    const { rowIndex, query, updateQueryState, row } = this.props;
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
                                text={row.columnText}
                                error={row.columnError}
                              />
                            </Form.Field>
                            <Form.Field>
                              <OperatorSearchBar
                                rowIndex={rowIndex}
                                updateQueryState={updateQueryState}
                                query={query}
                                operatorText={row.operatorText}
                                text={row.operatorTextText}
                              />
                            </Form.Field>
                            <Form.Field>
                              <Popup
                                trigger={
                                  <input
                                    type="text"
                                    onChange={e =>
                                      this.handleFilterChange(e.target.value)
                                    }
                                    value={
                                      query.where.whereRows[rowIndex].filter
                                    }
                                  />
                                }
                                content={
                                  query.where.whereRows[rowIndex].filterText
                                }
                                disabled={
                                  !query.where.whereRows[rowIndex].filterText
                                }
                                size="tiny"
                                position="top center"
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
  }
}

export default WhereRow;
