import React, { Component } from 'react';
import { Form, Input, Header, Icon, Button, Message } from 'semantic-ui-react';
import db from '../classes/db';

class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: null,
      user: null,
      password: null,
      port: null,
      database: null,
      open: true,
      error: false,
      success: false
    };
  }

  handleConnectHeaderClick = () => {
    this.setState(prevState => {
      return { open: !prevState.open,
              error: false,
              success: false};
    });
  };

  handleConnectButtonClick = () => {
    const { host, user, password, port, database } = this.state;
    const connectedDb = this.props.connectToDb(host, user, password, port, database);
    connectedDb && host && database ? this.setState({success: true, error: false}) : this.setState({error: true, success: false})
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { open } = this.state;
    return (
      <div
        style={{ marginTop: '100px', marginLeft: '50px', marginRight: '50px' }}
      >
        <Header
          style={{ cursor: 'pointer' }}
          onClick={this.handleConnectHeaderClick}
        >
          Connect To Database
          <Icon name={`caret square ${open ? 'up' : 'down'} outline`} />
        </Header>
        <Form
          style={{ display: open ? 'block' : 'none' }} 
          success
          error={this.state.error}
        >
          <Form.Group widths="equal">
            <Form.Field>
              <Input
                name="host"
                onChange={this.handleInputChange}
                fluid
                placeholder="Host"
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="user"
                onChange={this.handleInputChange}
                fluid
                placeholder="Username"
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="password"
                onChange={this.handleInputChange}
                fluid
                placeholder="Password"
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="port"
                onChange={this.handleInputChange}
                fluid
                placeholder="Port"
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="database"
                onChange={this.handleInputChange}
                fluid
                placeholder="Database"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Button
              style={{ marginLeft: '30px', maxHeight: '36px'}}
              type="button"
              onClick={this.handleConnectButtonClick}
            >
              Connect
              <Icon name="arrow circle right" />
            </Button>
          </Form.Group>
            {this.state.success ?
              <Message success header="Connected to Database" content={`You are now connected to ${this.state.database}`} />
              : ''}
              {this.state.error ?
              <Message
                error
                header="Connection Failed"
                content="Check your credentials and try again. By default you are connected to the tutorial database"
              />
              : ''}
        </Form>
      </div>
    );
  }
}

export default Connect;
