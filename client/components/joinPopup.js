import React, { Component } from "react";
import {
  Popup,
  Grid,
  Form,
  Input,
  Button,
  Image,
  Segment,
  Card,
} from "semantic-ui-react";

class JoinPopup extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  handleJoinTypeClick = joinType => {
    this.props.query.from.handleJoinTypeClick(this.props.rowIndex, joinType); // Update from row join type
    this.props.updateQueryState();
    this.handleClose();
  };
  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { query, rowIndex } = this.props;

    return (
      <Popup
        trigger={
          <Button basic color="violet" size="mini">
            {query.from.fromJoinRows[rowIndex].joinType ||
              `Choose Join Type ${rowIndex}`}
          </Button>
        }
        position="right center"
        keepInViewPort
        on={["click", "focus"]}
        hoverable
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        wide
      >
        <Card.Group itemsPerRow={2} textAlign="center">
          <Card
            image="static1.squarespace.png"
            header="Inner Join"
            style={{textAlign: 'center'}}
            extra={
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'INNER JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            }
          />
          <Card
            image="static1.squarespace-1.png"
            header="Left Join"
            style={{textAlign: 'center'}}
            extra={
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'LEFT JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            }
          />
          <Card
            image="static1.squarespace-2.png"
            header="Right Join"
            style={{textAlign: 'center'}}
            extra={
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'RIGHT JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            }
          />
          <Card
            image="static1.squarespace-3.png"
            header="Full Join"
            style={{textAlign: 'center'}}
            extra={
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'FULL JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            }
          />
        </Card.Group>
      </Popup>
    );
  }
}

export default JoinPopup;

// <Grid centered padded={false} className="JoinTypeTable">
//           <Grid.Row>
//             <Segment basic vertical compact>
//               <Image src="static1.squarespace.png" size="medium" />
//               <Button
//                 onClick={this.handleJoinTypeClick.bind(this, 'INNER JOIN')}
//                 positive
//                 size="tiny"
//               >
//                 Choose
//               </Button>
//             </Segment>
//             <Segment basic vertical compact>
//               <Image src="static1.squarespace-1.png" size="medium" />
//               <Button
//                 onClick={this.handleJoinTypeClick.bind(this, 'LEFT JOIN')}
//                 positive
//                 size="tiny"
//               >
//                 Choose
//               </Button>
//             </Segment>
//           </Grid.Row>

//           <Grid.Row>
//             <Segment basic vertical compact>
//               <Image src="static1.squarespace-2.png" size="medium" />
//               <Button
//                 onClick={this.handleJoinTypeClick.bind(this, 'RIGHT JOIN')}
//                 positive
//                 size="tiny"
//               >
//                 Choose
//               </Button>
//             </Segment>
//             <Segment basic vertical compact>
//               <Image src="static1.squarespace-3.png" size="medium" />
//               <Button
//                 onClick={this.handleJoinTypeClick.bind(this, 'FULL JOIN')}
//                 positive
//                 size="tiny"
//               >
//                 Choose
//               </Button>
//             </Segment>
//           </Grid.Row>
//         </Grid>
