import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import WhereRow from './whereRow';

const WhereClause = props => {
  const { query, updateQueryState, db } = props;

  const handleDraggableDrop = result => {
    if (result.destination) {
      let startIndex =
        result.destination.index < result.source.index
          ? result.destination.index
          : result.source.index;

      let endIndex =
        result.destination.index < result.source.index
          ? result.source.index
          : result.destination.index;

      query.where.handleDraggableDrop(
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
      <Droppable droppableId="droppableWhere">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Grid.Column width={12}>
              {query.where.whereRows.map((row, i) => {
                return (
                  <WhereRow
                    key={`whereRow-${i}`}
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

export default WhereClause;
