import React, { Component } from 'react';
import _ from 'lodash';
import { Table, Container } from 'semantic-ui-react';
import ConsoleSegment from './ConsoleSegment';

const tableData = [
  { name: 'John', age: 15, gender: 'Male' },
  { name: 'Amber', age: 40, gender: 'Female' },
  { name: 'Leslie', age: 25, gender: 'Female' },
  { name: 'Ben', age: 70, gender: 'Male' },
];

const fixConsole = () => {
  const consoleElem = document.getElementById('console');
  const bHeight = window.innerHeight;
  const offset = window.scrollY || 0;
  const consoleHeight = consoleElem.offsetHeight;
  consoleElem.style.top = bHeight + offset - consoleHeight + 'px';
};

const fixConsoleButton = () => {
  const consoleButtonElem = document.getElementById('consoleButton');
  const bHeight = window.innerHeight;
  const offset = window.scrollY || 0;
  const consoleButtonHeight = consoleButtonElem.offsetHeight;
  consoleButtonElem.style.top =
    bHeight + offset - consoleButtonHeight - 30 + 'px';
};

export default class ConsoleTable extends Component {
  state = {
    column: null,
    data: tableData,
    direction: null,
  };

  componentDidMount = () => {
    fixConsole();
    fixConsoleButton();

    window.addEventListener('scroll', () => {
      fixConsole();
      fixConsoleButton();
    });
  };

  componentDidUpdate = () => {
    fixConsole();
    fixConsoleButton();
  };

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });
      return;
    }
    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    const { column, data, direction } = this.state;
    return (
      <div id="console">
        {/* <Container id="console"> */}
        {/* <Container id="console"> */}
        <ConsoleSegment
          style={{ width: '60%' }}
          querySQL={this.props.query.toSql()}
        />

        <div style={{ display: this.props.showTable ? 'block' : 'none' }}>
          {this.props.query.queryResults ? (
            // <Table sortable celled fixed>
            <Table striped color="blue" size="small" compact="very">
              <Table.Header>
                <Table.Row>
                  {_.map(this.props.query.queryResults.fields, field => {
                    return (
                      <Table.HeaderCell
                        key={field.name}
                        sorted={column === field.name ? direction : null}
                        onClick={this.handleSort(field.name)}
                      >
                        {field.name}
                      </Table.HeaderCell>
                    );
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(this.props.query.queryResults.rows, (row, i) => (
                  <Table.Row key={i}>
                    {_.map(Object.entries(row), ([k, value]) => (
                      <Table.Cell>{value}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <div>Nothing yet</div>
          )}
        </div>
        {/* </Container> */}
      </div>
    );
  }
}
