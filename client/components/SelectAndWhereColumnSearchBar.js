import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class SelectAndWhereColumnSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      results: [],
      fullResults: [],
    };
  }

  componentDidMount() {
    this.resetComponent();

    this.setFullResultsState();
  }

  setFullResultsState = () => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      fullResults: this.props.fullResults.reduce((resultDrop, result) => {
        // eslint-disable-next-line no-param-reassign

        resultDrop[
          result.tableMetadata.name + ' (' + result.tableAlias + ')'
        ] = {
          name: result.tableMetadata.name + ' (' + result.tableAlias + ')',
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
    });
  };

  resetComponent = () =>
    this.setState({ isLoading: false, results: [] /*value: ''*/ });

  handleResultSelect = (e, { result }) =>
    this.props.modifyColumn(
      this.props.rowIndex,
      result.alias,
      result.tablename,
      result.title
    );

  handleSearchChange = (e, { value }) => {
    this.props.modifyColumn(this.props.rowIndex, null, null, value);

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

  render() {
    const { isLoading, results } = this.state;

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
