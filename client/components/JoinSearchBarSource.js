import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class JoinSearchBarSource extends Component {
  componentWillMount() {
    this.resetComponent();
    //this.setState({ value: this.props.selectedColumn });
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      //value: '',
    });

  handleResultSelect = (e, { result }) => {
    this.props.modifySourceColumn(
      this.props.joinSequence,
      `${result.tableName}.${result.title}`
    );
    //this.setState({ value: `${result.tableName}.${result.title}` });
  };

  handleSearchChange = (e, { value }) => {
    this.props.modifySourceColumn(this.props.joinSequence, value);
    this.setState({ isLoading: true /*value*/ });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(
          this.props.selectedColumn.split('.')[1] || this.props.selectedColumn
        ),
        'i'
      );
      const isMatch = result =>
        this.props.selectedColumn ? re.test(result.title) : true;

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.selectedTable.fields.map(column => {
            return {
              tableName: this.props.selectedTable.name,
              title: column.name,
            };
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
        value={this.props.selectedColumn}
      />
    );
  }
}
