import React, {Component} from 'react';
import {
  Popup,
  Grid,
  Form,
  Input,
  Button,
  Image,
  Segment,
} from 'semantic-ui-react';

class JoinPopup extends Component {
  constructor(props){
    super(props)
    this.state = {isOpen: false}
  }

  handleJoinTypeClick = joinType => {
  this.props.query.from.handleJoinTypeClick(this.props.rowIndex, joinType); // Update from row join type
  this.props.updateQueryState();
  this.handleClose();
  };
  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render(){
    const { query, rowIndex } = this.props;

    return (
      <Popup
        trigger={
          <Button>
            {query.from.fromJoinRows[rowIndex].joinType ||
              `Choose Join Type ${rowIndex}`}
          </Button>
        }
        position="bottom left"
        keepInViewPort
        wide="very"
        on={['click']}
        hoverable
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
      >
        <Grid centered padded={false} className="JoinTypeTable">
          <Grid.Row>
            <Segment basic vertical compact>
              <Image src="static1.squarespace.png" size="medium" />
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'INNER JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            </Segment>
            <Segment basic vertical compact>
              <Image src="static1.squarespace-1.png" size="medium" />
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'LEFT JOIN')}
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
                onClick={this.handleJoinTypeClick.bind(this, 'RIGHT JOIN')}
                positive
                size="tiny"
              >
                Choose
              </Button>
            </Segment>
            <Segment basic vertical compact>
              <Image src="static1.squarespace-3.png" size="medium" />
              <Button
                onClick={this.handleJoinTypeClick.bind(this, 'FULL JOIN')}
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
  }
}

export default JoinPopup;
