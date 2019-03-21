import _ from "lodash";
import React, { Component } from "react";
import { Search, Label } from "semantic-ui-react";

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class TableSearchBar extends Component {
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

  modifyFromRowTable = tableName => {
    this.props.query.from.modifyFromRowTable(this.props.rowIndex, tableName);
    this.props.updateQueryState();
  };

  handleResultSelect = (e, { result }) => {
    this.modifyFromRowTable(result.title);
    //this.setState({ value: result.title });
  };

  handleSearchChange = (e, { value }) => {
    this.modifyFromRowTable(value);
    //this.setState({ isLoading: true /*value */ });

    setTimeout(() => {
      //if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.props.tableText), "i");
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.resultTables().map(tableName => {
            return { title: tableName };
          }),
          isMatch,
        ),
      });
    }, 100);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        icon="table"
        placeholder={`Table ${this.props.rowIndex + 1}`}
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true,
        })}
        onFocus={this.handleSearchChange}
        onMouseDown={this.handleSearchChange}
        results={results}
        value={this.props.tableText}
        minCharacters={0}
      />
    );
  }
}
