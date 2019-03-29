import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import FromJoinRow from './fromJoinRow';

const FromClause = props => {
  const { query, updateQueryState, db, runPopupFix } = props;

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
      <Droppable droppableId="droppableFrom">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div style={{ width: '100%' }}>
              {query.from.fromJoinRows.map((row, i) => {
                return (
                  <FromJoinRow
                    key={`fromJoinRow-${i}`}
                    query={query}
                    updateQueryState={updateQueryState}
                    runPopupFix={runPopupFix}
                    rowIndex={i}
                    row={row}
                    db={db}
                  />
                );
              })}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FromClause;
