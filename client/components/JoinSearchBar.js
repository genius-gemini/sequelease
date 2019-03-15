import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class JoinSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();

    this.setState({
      columnsToSelect: this.props.columnsToSelect.reduce((memo, table) => {
        // eslint-disable-next-line no-param-reassign
        memo[table.name] = {
          name: table.name,
          results: table.fields
            ? table.fields.map(column => ({
                tableName: table.name,
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
    this.props.modifyTargetColumn(
      this.props.joinSequence,
      `${result.tableName}.${result.title}`
    );

  handleSearchChange = (e, { value }) => {
    this.props.modifyTargetColumn(this.props.joinSequence, value);
    this.setState({
      columnsToSelect: this.props.columnsToSelect.reduce((memo, table) => {
        // eslint-disable-next-line no-param-reassign
        memo[table.name] = {
          name: table.name,
          results: table.fields
            ? table.fields.map(column => ({
                tableName: table.name,
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
          this.props.selectedColumn.split('.')[1] ||
            this.props.selectedColumn.value
        ),
        'i'
      );

      const isMatch = result => {
        if (this.props.selectedColumn) {
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
        value={this.props.selectedColumn}
      />
    );
  }
}
