import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

export default class ConsoleSegment extends Component {
  // eslint-disable-next-line complexity
  buildQueryString = () => {
    let select = 'SELECT\n';

    let selectColumns = '';
    if (
      this.props.queryState.select.selectedColumns.length &&
      this.props.queryState.select.selectedColumns[0].name.trim()
    ) {
      selectColumns = this.props.queryState.select.selectedColumns
        .filter(column => column.name.trim())
        .map(column => {
          return column.name;
        })
        .join(', ');
    }
    if (selectColumns) {
      select += '  ' + selectColumns;
    } else {
      select += '  1';
    }

    let from = '\nFROM\n';

    let fromClause = '';

    if (
      this.props.queryState.from.selectedTables.length &&
      this.props.queryState.from.selectedTables[0].tableText.trim()
    ) {
      fromClause = this.props.queryState.from.selectedTables
        .filter(table => table.table.name)
        .map((table, i) => {
          if (i === 0) {
            return table.table.name;
          } else {
            let ij = 'INNER JOIN ' + table.tableText;

            ij +=
              table.sourceJoinColumn.name && table.targetJoinColumn.name
                ? ' ON ' +
                  table.sourceJoinColumn.name +
                  ' = ' +
                  table.targetJoinColumn.name
                : '';
            return ij;
          }
        })
        .join('\n  ');
    }
    if (fromClause) {
      from += '  ' + fromClause;
    } else {
      from = '';
    }

    let where = '\nWHERE\n';
    let whereClause = '';
    if (
      this.props.queryState.where.selectedWhereColumns.length &&
      this.props.queryState.where.selectedWhereColumns[0].name.trim()
    ) {
      whereClause = this.props.queryState.where.selectedWhereColumns
        .filter(
          condition =>
            condition.type &&
            condition.selectedOperator.operator &&
            condition.filter
        )
        .map((condition, i) => {
          let initText = 'AND ';
          if (i === 0) {
            initText = '  ';
          }
          return (
            initText +
            condition.name +
            ' ' +
            condition.selectedOperator.operator +
            ' ' +
            condition.filter
          );
        })
        .join('\n  ');
    }

    if (whereClause) {
      where += whereClause;
    } else {
      where = '';
    }

    return select + from + where;
  };

  render() {
    return (
      <Segment>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            display: 'inline-block',
            textAlign: 'left',
          }}
        >
          {this.buildQueryString()}
        </div>
      </Segment>
    );
  }
}
