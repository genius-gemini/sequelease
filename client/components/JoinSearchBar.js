import _ from "lodash";
import React, { Component } from "react";
import { Search, Label, Popup } from "semantic-ui-react";

export default class JoinSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      results: [],
      previousTablesJoinColumns: [],
    };
  }

  componentDidMount() {
    this.resetComponent();

    this.setJoinColumnsState();
  }

  modifyPreviousTableJoinColumn = (alias, tableName, column) => {
    this.props.query.from.modifyPreviousTableJoinColumn(
      this.props.rowIndex,
      this.props.joinColumnIndex,
      alias,
      tableName,
      column,
    );
    this.props.updateQueryState();
  };

  setJoinColumnsState = () => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      previousTablesJoinColumns: _.reduce(
        this.props.previousTablesJoinColumns,
        (resultDrop, previousTable) => {
          // eslint-disable-next-line no-param-reassign

          resultDrop[
            previousTable.tableMetadata.name +
              " (" +
              previousTable.tableAlias +
              ")"
          ] = {
            name:
              previousTable.tableMetadata.name +
              " (" +
              previousTable.tableAlias +
              ")",
            results: previousTable.tableMetadata.fields
              ? _.map(previousTable.tableMetadata.fields, column => ({
                  alias: previousTable.tableAlias,
                  tablename: previousTable.tableMetadata.name,
                  title: column.name,
                }))
              : [],
          };
          return resultDrop;
        },
        {},
      ),
    });
  };

  resetComponent = () => this.setState({ isLoading: false, results: [] });

  handleResultSelect = (e, { result }) =>
    this.modifyPreviousTableJoinColumn(
      result.alias,
      result.tablename,
      result.alias + "." + result.title,
    );

  handleSearchMousedown = (e, { value }) => {
    this.modifyPreviousTableJoinColumn(null, null, value);

    this.setJoinColumnsState();

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const filteredResults = this.state.previousTablesJoinColumns;

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 100);
  };

  handleSearchChange = (e, { value }) => {
    this.modifyPreviousTableJoinColumn(null, null, value);

    this.setJoinColumnsState();

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(
        _.escapeRegExp(
          this.props.previousTableJoinColumn.split(".")[1] ||
            this.props.previousTableJoinColumn.split(".")[0] ||
            this.props.previousTableJoinColumn,
        ),
        "i",
      );

      const isMatch = result => {
        if (this.props.previousTableJoinColumn) {
          return (
            re.test(result.title) ||
            re.test(result.tablename) ||
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
        {},
      );

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 100);
  };

  render() {
    const { isLoading, results } = this.state;

    return (
      <Popup
        trigger={
          <Search
            size="mini"
            icon="columns"
            placeholder={`Table ${this.props.rowIndex} to table ${this.props
              .rowIndex + 1} join column`}
            category
            input={{
              error: !this.props.initial && this.props.error,
            }}
            className="column-search-bar"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            minCharacters={0}
            onFocus={this.handleSearchChange}
            onBlur={(e, data) => {
              this.props.query.from.fromJoinRows[
                this.props.rowIndex
              ].joinColumns[
                this.props.joinColumnIndex
              ].previousTableJoinColumn.initial = false;
              this.handleSearchChange(e, data);
            }}
            onMouseDown={this.handleSearchMousedown}
            results={results}
            value={this.props.previousTableJoinColumn}
          />
        }
        content={this.props.text}
        horizontalOffset={!this.props.text ? -10000 : 0}
        size="tiny"
        position="top center"
      />
    );
  }
}
