import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  Form,
  Input,
  Button,
  Grid,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react';
import HandGrab from './handGrab';

import { Draggable } from 'react-beautiful-dnd';
import Buttons from './buttons';

import SelectAndWhereColumnSearchBar from './SelectAndWhereColumnSearchBar';

let portal = document.createElement('div');
document.body.appendChild(portal);

const PortalDraggableItem = props => {
  let result = (
    <div ref={props.provided.innerRef} {...props.provided.draggableProps}>
      <div className="drag">
        <div style={{ position: 'relative', width: '1400px' }}>
          <div
            {...props.provided.dragHandleProps}
            style={{ marginTop: '5px', display: 'inline-block' }}
          >
            <HandGrab />
          </div>
          <div style={{ marginTop: '5px', display: 'inline-block' }}>
            <Buttons
              type="selectRow"
              updateQueryState={props.updateQueryState}
              rowIndex={props.rowIndex}
              query={props.query}
            />
          </div>
          <div style={{ marginTop: '5px', display: 'inline-block' }}>
            {/* {rowIndex > 0 ? (
                        <div style={{ display: 'inline-block' }}>,&nbsp;</div>
                      ) : null} */}
            <div style={{ display: 'inline-block' }}>
              <SelectAndWhereColumnSearchBar
                type="select"
                rowIndex={props.rowIndex}
                updateQueryState={props.updateQueryState}
                query={props.query}
                value={props.row.name}
                text={props.row.text}
                error={props.row.error}
                initial={props.row.initial}
              />
            </div>
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

class SelectRow extends Component {
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
                snapshot={snapshot}
                provided={provided}
                row={row}
                query={query}
                updateQueryState={updateQueryState}
                rowIndex={rowIndex}
              />
              {provided.placeholder}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

export default SelectRow;
