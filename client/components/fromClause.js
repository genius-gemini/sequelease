import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import InnerGrid from './innerGrid';

const FromClause = props => {
  const { query, updateQueryState, db } = props;

  const handleDraggableDrop = result => {
    if (result.destination.index) {
      let startIndex =
        result.destination.index < result.source.index
          ? result.destination.index
          : result.source.index;

      let endIndex =
        result.destination.index < result.source.index
          ? result.source.index
          : result.destination.index;

      query.from.handleDraggableDrop(
        result.source.index,
        result.destination.index,
        startIndex,
        endIndex
      );

      updateQueryState();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDraggableDrop}>
      <Droppable droppableId="droppableSelect">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Grid.Column width={12}>
              {query.from.fromJoinRows.map((row, i) => {
                return (
                  <InnerGrid
                    key={`fromJoinRow-${i}`}
                    query={query}
                    updateQueryState={updateQueryState}
                    rowIndex={i}
                    row={row}
                    db={db}
                  />
                );
              })}
            </Grid.Column>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FromClause;
