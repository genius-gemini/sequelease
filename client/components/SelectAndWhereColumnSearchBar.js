import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Popup } from 'semantic-ui-react';

export default class SelectAndWhereColumnSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      results: [],
      fullResults: [],
      first: true,
    };
  }

  componentDidMount() {
    this.resetComponent();

    this.setFullResultsState();

    const searchBar = document.getElementById(
      `search-bar-${this.props.type}-${this.props.rowIndex}`
    );
    searchBar.focus();
    searchBar.blur();
  }

  modifyColumn = (alias, tableName, value) => {
    if (this.props.type === 'select') {
      this.props.query.select.modifySelectColumn(
        this.props.rowIndex,
        alias,
        tableName,
        value
      );
    } else if (this.props.type === 'where') {
      this.props.query.where.modifyWhereColumn(
        this.props.rowIndex,
        alias,
        tableName,
        value
      );
    }
    this.props.updateQueryState();
  };

  setFullResultsState = () => {
    let fullResults = {};

    if (this.props.type === 'select') {
      fullResults.All = {
        name: 'all',
        alias: null,
        results: [{ tableName: 'all', alias: null, title: '*' }],
      };
    }

    fullResults = {
      ...fullResults,
      ...this.props.query.fullResults.results.reduce((resultDrop, result) => {
        // eslint-disable-next-line no-param-reassign

        resultDrop[
          result.tableMetadata.name + ' (' + result.tableAlias + ')'
        ] = {
          name: result.tableMetadata.name + ' (' + result.tableAlias + ')',
          tableAlias: result.tableAlias,
          results: result.tableMetadata.fields
            ? result.tableMetadata.fields.map(column => ({
                alias: result.tableAlias,
                tablename: result.tableMetadata.name,
                title: column.name,
              }))
            : [],
        };
        return resultDrop;
      }, {}),
    };

    if (this.props.type === 'select') {
      Object.keys(fullResults).forEach(key => {
        if (key !== 'All') {
          fullResults[key].results.unshift({
            tableName: fullResults[key].name,
            alias: fullResults[key].tableAlias,
            title: '*',
          });
        }
      });
    }

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      fullResults,
    });
  };

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], first: true /*value: ''*/ });

  handleResultSelect = (e, { result }) =>
    this.modifyColumn(result.alias, result.tablename, result.title);

  handleSearchChange = (e, { value }) => {
    this.modifyColumn(null, null, value);

    this.setFullResultsState();

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
            re.test(result.tablename) ||
            re.test(result.tableAlias)
          );
        } else {
          return true;
        }
      };

      const filteredResults = _.reduce(
        this.state.fullResults,
        (resultDrop, data, name) => {
          const results = _.filter(data.results, isMatch);
          if (results.length) resultDrop[name] = { name, results }; // eslint-disable-line no-param-reassign

          return resultDrop;
        },
        {}
      );

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 100);
  };

  handleSearchChangeMousedown = () => {
    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const filteredResults = this.state.fullResults;

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
            placeholder={`${
              this.props.type === 'select' ? 'Select' : 'Where'
            } column ${this.props.rowIndex + 1}`}
            icon="columns"
            input={{
              error: !this.props.initial && this.props.error,
            }}
            id={`search-bar-${this.props.type}-${this.props.rowIndex}`}
            category
            className="column-search-bar"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            minCharacters={0}
            onFocus={(e, data) => {
              this.handleSearchChange(e, data);
              e.target.select();
            }}
            onMouseDown={this.handleSearchChangeMousedown}
            onBlur={(e, data) => {
              if (!this.state.first) {
                this.props.query[this.props.type][this.props.type + 'Rows'][
                  this.props.rowIndex
                ].initial = false;
                this.handleSearchChange(e, data);
              } else {
                this.props.query[this.props.type][this.props.type + 'Rows'][
                  this.props.rowIndex
                ].initial = true;
                this.setState({ first: false });
              }
            }}
            results={results}
            value={this.props.value}
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
