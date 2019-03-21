import React from "react";
import {
  Popup,
  Grid,
  Form,
  Input,
  Button,
  Image,
  Segment,
} from "semantic-ui-react";

const JoinPopup = props => {
  const { query, rowIndex, updateQueryState } = props;
  const handleJoinTypeClick = joinType => {
    query.from.handleJoinTypeClick(rowIndex, joinType); // Update from row join type

    updateQueryState();
  };

  return (
    <Popup
      trigger={
        <Button>
          {query.from.fromJoinRows[rowIndex].joinType || "Choose a Join Type"}
        </Button>
      }
      flowing
      hoverable
      size="small"
      position="bottom center"
    >
      <Grid centered padded={false}>
        <Grid.Row>
          <Segment basic vertical compact>
            <Image src="static1.squarespace.png" size="medium" />
            <Button
              onClick={handleJoinTypeClick.bind(this, "INNER JOIN")}
              positive
              size="tiny"
            >
              Choose
            </Button>
          </Segment>
          <Segment basic vertical compact>
            <Image src="static1.squarespace-1.png" size="medium" />
            <Button
              onClick={handleJoinTypeClick.bind(this, "LEFT JOIN")}
              positive
              size="tiny"
            >
              Choose
            </Button>
          </Segment>
        </Grid.Row>

        <Grid.Row>
          <Segment basic vertical compact>
            <Image src="static1.squarespace-2.png" size="medium" />
            <Button
              onClick={handleJoinTypeClick.bind(this, "RIGHT JOIN")}
              positive
              size="tiny"
            >
              Choose
            </Button>
          </Segment>
          <Segment basic vertical compact>
            <Image src="static1.squarespace-3.png" size="medium" />
            <Button
              onClick={handleJoinTypeClick.bind(this, "FULL JOIN")}
              positive
              size="tiny"
            >
              Choose
            </Button>
          </Segment>
        </Grid.Row>
      </Grid>
    </Popup>
  );
};

export default JoinPopup;
