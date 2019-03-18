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

export default class ConsoleTable extends Component {
  state = {
    column: null,
    data: tableData,
    direction: null,
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
      <Container id="console">
        <ConsoleSegment queryState={this.props.queryState} />
        {this.props.queryResults ? (
          <Table sortable celled fixed>
            <Table.Header>
              <Table.Row>
                {_.map(this.props.queryResults.fields, field => {
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
              {_.map(this.props.queryResults.rows, (row, i) => (
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
      </Container>
    );
  }
}
