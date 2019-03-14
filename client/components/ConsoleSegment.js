import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

export default class ConsoleSegment extends Component {
  render() {
    return (
      <Segment>
        SELECT col1 FROM table1 <br />
        INNER JOIN table2 <br />
        WHERE col1 = "example" <br />
        AND col2 = "anotherExample"
      </Segment>
    );
  }
}
