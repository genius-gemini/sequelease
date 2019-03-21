import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class JoinSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      previousTablesJoinColumns: this.props.previousTablesJoinColumns.reduce(
        (memo, previousTable) => {
          // eslint-disable-next-line no-param-reassign

          memo[
            previousTable.tableMetadata.name +
              ' (' +
              previousTable.tableAlias +
              ')'
          ] = {
            name:
              previousTable.tableMetadata.name +
              ' (' +
              previousTable.tableAlias +
              ')',
            results: previousTable.tableMetadata.fields
              ? previousTable.tableMetadata.fields.map(column => ({
                  alias: previousTable.tableAlias,
                  tableName: previousTable.tableMetadata.name,
                  title: column.name,
                }))
              : [],
          };
          return memo;
        },
        {}
      ),
    });
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [] /*value: ''*/ });

  handleResultSelect = (e, { result }) =>
    this.props.modifyPreviousTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      result.alias,
      result.tableName,
      result.alias + '.' + result.title
    );

  handleSearchChange = (e, { value }) => {
    this.props.modifyPreviousTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      null,
      null,
      value
    );
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      previousTablesJoinColumns: this.props.previousTablesJoinColumns.reduce(
        (memo, previousTable) => {
          // eslint-disable-next-line no-param-reassign

          memo[
            previousTable.tableMetadata.name +
              ' (' +
              previousTable.tableAlias +
              ')'
          ] = {
            name:
              previousTable.tableMetadata.name +
              ' (' +
              previousTable.tableAlias +
              ')',
            results: previousTable.tableMetadata.fields
              ? previousTable.tableMetadata.fields.map(column => ({
                  alias: previousTable.tableAlias,
                  tableName: previousTable.tableMetadata.name,
                  title: column.name,
                }))
              : [],
          };

          return memo;
        },
        {}
      ),
      //isLoading: true,
    });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(
          this.props.previousTableJoinColumn.split('.')[1] ||
            this.props.previousTableJoinColumn.split('.')[0] ||
            this.props.previousTableJoinColumn
        ),
        'i'
      );

      const isMatch = result => {
        if (this.props.previousTableJoinColumn) {
          return (
            re.test(result.title) ||
            re.test(result.tableName) ||
            re.test(result.tableAlias)
          );
        } else {
          return true;
        }
      };

      const filteredResults = _.reduce(
        this.state.previousTablesJoinColumns,
        (memo, data, name) => {
          const results = _.filter(data.results, isMatch);
          if (results.length) memo[name] = { name, results }; // eslint-disable-line no-param-reassign

          return memo;
        },
        {}
      );

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 100);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        category
        className="column-search-bar"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true,
        })}
        minCharacters={0}
        onFocus={this.handleSearchChange}
        onMouseDown={this.handleSearchChange}
        results={results}
        value={this.props.previousTableJoinColumn}
      />
    );
  }
}
