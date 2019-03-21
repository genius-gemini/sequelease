import React from "react";
import { Grid } from "semantic-ui-react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import InnerGrid from "./innerGrid";

const FromClause = props => {
  const { query, updateQueryState } = props;

  return (
    <DragDropContext onDragEnd={() => console.log("On drag end")}>
      <Droppable droppableId="droppableSelect">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Grid.Column width={12}>
              {query.from.fromJoinRows.map((row, i) => {
                return (
                  <InnerGrid
                    key={`fromRow-${i}`}
                    query={query}
                    updateQueryState={updateQueryState}
                    rowIndex={i}
                    row={row}
                    className="drag"
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
