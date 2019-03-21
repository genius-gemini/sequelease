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
    this.props.modifyRowTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      result.alias,
      result.tableName,
      result.alias + '.' + result.title
    );
    //this.setState({ value: `${result.tableName}.${result.title}` });
  };

  handleSearchChange = (e, { value }) => {
    this.props.modifyRowTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      null,
      null,
      value
    );
    //this.setState({ isLoading: true /*value*/ });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(
          this.props.columnText.split('.')[1] || this.props.columnText
        ),
        'i'
      );
      const isMatch = result =>
        this.props.columnText ? re.test(result.title) : true;

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.table.fields
            ? this.props.table.fields.map(column => {
                return {
                  tableName: this.props.table.name,
                  title: column.name,
                  alias: this.props.tableAlias,
                };
              })
            : [],
          isMatch
        ),
      });
    }, 100);
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
        value={this.props.columnText}
      />
    );
  }
}
