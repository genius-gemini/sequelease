import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class TableSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();
    this.setState({ value: this.props.selectedColumn });
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      value: '',
    });

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
      const isMatch = result =>
        this.state.value ? re.test(result.title) : true;

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.columnsToSelect.map(column => {
            return { tableName: this.props.selectedTable, title: column };
          }),
          isMatch
        ),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
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
