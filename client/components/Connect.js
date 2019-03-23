import React, { Component } from 'react';
import { Form, Input, Header, Icon, Button } from 'semantic-ui-react';
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
    };
  }

  handleConnectHeaderClick = () => {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  };

  handleConnectButtonClick = () => {
    const { host, user, password, port, database } = this.state;
    this.props.connectToDb(host, user, password, port, database);
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
        <Form style={{ display: open ? 'block' : 'none' }}>
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
              style={{ marginLeft: '30px' }}
              type="button"
              onClick={this.handleConnectButtonClick}
            >
              Connect
              <Icon name="arrow circle right" />
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default Connect;
