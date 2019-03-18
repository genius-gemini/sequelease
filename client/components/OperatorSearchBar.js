import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class OperatorSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();
    //this.setState({ value: this.props.selectedTable });
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      //value: '',
    });

  handleResultSelect = (e, { result }) => {
    this.props.modifyOperator(this.props.operatorSequence, result.title);
    //this.setState({ value: result.title });
  };

  handleSearchChange = (e, { value }) => {
    this.props.modifyOperator(this.props.operatorSequence, value);
    //this.setState({ isLoading: true /*value */ });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.props.operatorText), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.operatorsToSelect.map(op => {
            return { title: op.operator };
          }),
          isMatch
        ),
      });
    }, 100);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true,
        })}
        onFocus={this.handleSearchChange}
        onMouseDown={this.handleSearchChange}
        results={results}
        value={this.props.operatorText}
        minCharacters={0}
      />
    );
  }
}
