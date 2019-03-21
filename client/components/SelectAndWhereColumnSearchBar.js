import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class SelectAndWhereColumnSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      fullResults: this.props.fullResults.reduce((memo, result) => {
        // eslint-disable-next-line no-param-reassign

        memo[result.tableMetadata.name + ' (' + result.tableAlias + ')'] = {
          name: result.tableMetadata.name + ' (' + result.tableAlias + ')',
          results: result.tableMetadata.fields
            ? result.tableMetadata.fields.map(column => ({
                alias: result.tableAlias,
                tableName: result.tableMetadata.name,
                title: column.name,
              }))
            : [],
        };
        return memo;
      }, {}),
    });
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [] /*value: ''*/ });

  handleResultSelect = (e, { result }) =>
    this.props.modifyColumn(
      this.props.rowIndex,
      result.alias,
      result.tableName,
      result.title
    );

  handleSearchChange = (e, { value }) => {
    this.props.modifyColumn(this.props.rowIndex, null, null, value);
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      fullResults: this.props.fullResults.reduce((memo, result) => {
        // eslint-disable-next-line no-param-reassign

        memo[result.tableMetadata.name + ' (' + result.tableAlias + ')'] = {
          name: result.tableMetadata.name + ' (' + result.tableAlias + ')',
          results: result.tableMetadata.fields
            ? result.tableMetadata.fields.map(column => ({
                alias: result.tableAlias,
                tableName: result.tableMetadata.name,
                title: column.name,
              }))
            : [],
        };

        return memo;
      }, {}),
      //isLoading: true,
    });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(
          this.props.value.split('.')[1] ||
            this.props.value.split('.')[0] ||
            this.props.value
        ),
        'i'
      );

      const isMatch = result => {
        if (this.props.value) {
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
        this.state.fullResults,
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
        value={this.props.value}
      />
    );
  }
}
