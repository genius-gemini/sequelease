import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const withQueryDetail = WrappedComponent => {
  // eslint-disable-next-line react/display-name
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = { clause: null };

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

    setClause = clause => {
      this.setState({ clause });
    };

    handleDraggableDrop = result => {
      if (result.destination.index) {
        let startIndex =
          result.destination.index < result.source.index
            ? result.destination.index
            : result.source.index;

        let endIndex =
          result.destination.index < result.source.index
            ? result.source.index
            : result.destination.index;

        this.state.clause.handleDraggableDrop(
          result.source.index,
          result.destination.index,
          startIndex,
          endIndex
        );

        this.props.updateQueryState();
      }
    };

    render() {
      return (
        <DragDropContext onDragEnd={this.handleDraggableDrop}>
          <Droppable droppableId="droppableSelect">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <div>
                  <WrappedComponent
                    setClause={this.setClause}
                    handleDraggableDrop={this.handleDraggableDrop}
                    {...this.props}
                  />
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
  };
};

export default withQueryDetail;
