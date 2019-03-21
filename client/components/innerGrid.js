import React from "react";
import {
  Form,
  Input,
  Button,
  Grid,
  Header,
  Image,
  Segment,
} from "semantic-ui-react";

import { Draggable } from "react-beautiful-dnd";
import Buttons from "./buttons";
import JoinPopup from "./joinPopup";
import TableSearchBar from "./TableSearchBar";

const InnerGrid = props => {
  const {
    rowIndex,
    query,
    handleAddJoinRowClick,
    updateQueryState,
    db,
    row,
  } = props;

  return (
    <Draggable key={`itemS`} draggableId={`itemS`} index={1}>
      {(provided, snapshot) => {
        return (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              <Grid columns={2} celled>
                <Grid.Row style={{ padding: "7px" }}>
                  <Grid.Column style={{ width: "600px", height: "38px" }}>
                    <Form>
                      <Form.Group inline>
                        <Form.Field>
                          <Buttons
                            updateQueryState={updateQueryState}
                            rowIndex={rowIndex}
                            query={query}
                          />
                        </Form.Field>
                        <Form.Field>
                          <JoinPopup
                            updateQueryState={updateQueryState}
                            rowIndex={rowIndex}
                            query={query}
                          />
                        </Form.Field>
                        <Form.Field error={true}>
                          <TableSearchBar
                            rowIndex={rowIndex}
                            resultTables={db.getTableNames}
                            table={row.tableMetadata.name}
                            tableText={row.tableText}
                            updateQueryState={updateQueryState}
                            query={query}
                          />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                  <Grid.Column style={{ width: "500px", height: "38px" }}>
                    <Form>
                      <Form.Group inline>
                        <Form.Field>
                          <label>ON</label>
                        </Form.Field>
                        <Form.Field />
                        <Form.Field>
                          <label>=</label>
                        </Form.Field>
                        <Form.Field />
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
};

export default InnerGrid;

// const Buttons = props => (
//   //   <Button.Group basic size="small">
//   <div>
//     <Button
//     onClick={console.log('plus button pressed')}
//     circular color="green" icon="plus" size="tiny" />
//     <Button circular color="red" icon="trash" size="tiny" />
//   </div>
//   //   </Button.Group>
// );
