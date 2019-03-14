import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class JoinSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();

    this.setState({
      value: this.props.selectedColumn,
      columnsToSelect: this.props.columnsToSelect.reduce((memo, table) => {
        // eslint-disable-next-line no-param-reassign
        memo[table.name] = {
          name: table.name,
          results: table.columns.map(column => ({
            tableName: table.name,
            title: column,
          })),
        };

        return memo;
      }, {}),
    });
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: `${result.tableName}.${result.title}` });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(this.state.value.split('.')[1] || this.state.value),
        'i'
      );

      const isMatch = result => {
        if (this.state.value) {
          return re.test(result.title) || re.test(result.tableName);
        } else {
          return true;
        }
      };

      const filteredResults = _.reduce(
        this.state.columnsToSelect,
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
    }, 300);
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
        value={value}
      />
    );
  }
}
