import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
import HandGrab from './handGrab';

import { Draggable } from 'react-beautiful-dnd';
import Buttons from './buttons';

import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';

import OperatorSearchBar from './OperatorSearchBar';

let portal = document.createElement('div');
document.body.appendChild(portal);

const PortalDraggableItem = props => {
  const handleFilterChange = value => {
    const { rowIndex, query, updateQueryState } = props;
    query.where.handleFilterChange(value, rowIndex);

    updateQueryState();
  };

  let result = (
    <div ref={props.provided.innerRef} {...props.provided.draggableProps}>
      <div className="drag">
        <div style={{ width: '1400px', position: 'relative' }}>
          <div
            {...props.provided.dragHandleProps}
            style={{ marginTop: '5px', display: 'inline-block' }}
          >
            <HandGrab />
          </div>
          <div style={{ marginTop: '5px', display: 'inline-block' }}>
            <Buttons
              type="whereRow"
              updateQueryState={props.updateQueryState}
              rowIndex={props.rowIndex}
              query={props.query}
            />
          </div>
          {props.rowIndex > 0 ? (
            <div style={{ marginRight: '5px', display: 'inline-block' }}>
              AND
            </div>
          ) : null}

          <div style={{ marginTop: '5px', display: 'inline-block' }}>
            <SelectAndWhereColumnSearchBar
              type="where"
              rowIndex={props.rowIndex}
              updateQueryState={props.updateQueryState}
              query={props.query}
              value={props.row.name}
              text={props.row.columnText}
              error={props.row.columnError}
              initial={props.row.initial}
            />
          </div>
          <div
            style={{
              marginTop: '5px',
              display: 'inline-block',
              marginLeft: '5px',
            }}
          >
            <OperatorSearchBar
              rowIndex={props.rowIndex}
              updateQueryState={props.updateQueryState}
              query={props.query}
              operatorText={props.row.operatorText}
              text={props.row.operatorTextText}
              error={props.row.operatorError}
            />
          </div>

          <div
            style={{
              marginTop: '5px',
              display: 'inline-block',
              marginLeft: '5px',
            }}
          >
            <Popup
              trigger={
                <Input
                  size="mini"
                  type="text"
                  placeholder={`Filter ${props.rowIndex + 1}`}
                  onChange={e => handleFilterChange(e.target.value)}
                  value={props.query.where.whereRows[props.rowIndex].filter}
                />
              }
              //content={query.where.whereRows[rowIndex].filterText}
              horizontalOffset={
                !props.query.where.whereRows[props.rowIndex].filterText
                  ? -10000
                  : 0
              }
              size="tiny"
              position="top center"
              on={['focus', 'hover']}
            >
              <Popup.Content>
                {props.query.where.whereRows[props.rowIndex].filterText}
              </Popup.Content>
            </Popup>
          </div>
        </div>
      </div>
    </div>
  );

  if (props.snapshot.isDragging) {
    return ReactDOM.createPortal(result, portal);
  }
  return result;
};

class WhereRow extends Component {
  componentDidMount = () => {
    [
      ...document.querySelectorAll('[data-react-beautiful-dnd-drag-handle]'),
    ].map(elem => elem.removeAttribute('tabindex'));
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
              <PortalDraggableItem
                rowIndex={rowIndex}
                query={query}
                updateQueryState={updateQueryState}
                row={row}
                provided={provided}
                snapshot={snapshot}
              />
              {provided.placeholder}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

export default WhereRow;
