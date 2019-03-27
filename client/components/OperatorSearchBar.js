import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Popup } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class OperatorSearchBar extends Component {
  componentWillMount() {
    this.resetComponent();
    //this.setState({ value: this.props.selectedTable });
  }

  modifyOperator = operator => {
    this.props.query.where.modifyOperator(this.props.rowIndex, operator);

    this.props.updateQueryState();
  };

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      //value: '',
    });

  handleResultSelect = (e, { result }) => {
    this.modifyOperator(result.title);
    //this.setState({ value: result.title });
  };

  handleSearchChange = (e, { value }) => {
    this.modifyOperator(value);
    //this.setState({ isLoading: true /*value */ });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.props.operatorText), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.query.where.operators.map(op => {
            return { title: op.name };
          }),
          isMatch
        ),
      });
    }, 100);
  };

  handleSearchChangeMousedown = () => {
    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      this.setState({
        isLoading: false,
        results: this.props.query.where.operators.map(op => {
          return { title: op.name };
        }),
      });
    }, 100);
  };

  render() {
    const { isLoading, results } = this.state;

    return (
      <Popup
        trigger={
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            input={{ icon: false }}
            placeholder={`Operator ${this.props.rowIndex + 1}`}
            size="mini"
            onFocus={(e, data) => {
              this.handleSearchChange(e, data);
              e.target.select();
            }}
            onMouseDown={this.handleSearchChangeMousedown}
            results={results}
            value={this.props.operatorText}
            minCharacters={0}
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
