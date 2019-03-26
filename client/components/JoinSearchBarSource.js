import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Popup } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class JoinSearchBarSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      results: [],
    };
  }

  componentDidMount() {
    this.resetComponent();
    //this.setState({ value: this.props.selectedColumn });
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      //value: '',
    });

  modifyRowTableJoinColumn = (alias, tableName, column) => {
    this.props.query.from.modifyRowTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      alias,
      tableName,
      column
    );
    this.props.updateQueryState();
  };

  handleResultSelect = (e, { result }) => {
    this.modifyRowTableJoinColumn(
      result.alias,
      result.tablename,
      result.alias + '.' + result.title
    );
    //this.setState({ value: `${result.tablename}.${result.title}` });
  };

  handleSearchChange = (e, { value }) => {
    this.modifyRowTableJoinColumn(null, null, value);
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
                  tablename: this.props.table.name,
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
    const { isLoading, results } = this.state;

    return (
      <Popup
        trigger={
          <Search
            input={{
              error: !this.props.initial && this.props.error,
            }}
            className="column-search-bar"
            size="mini"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            onBlur={(e, data) => {
              this.props.query.from.fromJoinRows[
                this.props.rowIndex
              ].joinColumns[
                this.props.joinColumnIndex
              ].rowTableJoinColumn.initial = false;
              this.handleSearchChange(e, data);
            }}
            minCharacters={0}
            onFocus={this.handleSearchChange}
            onMouseDown={this.handleSearchChange}
            results={results}
            value={this.props.columnText}
          />
        }
        content={this.props.text}
        horizontalOffset={!this.props.text ? -10000 : 0}
        size="tiny"
        position="top center"
        on={['focus', 'hover']}
      />
    );
  }
}
