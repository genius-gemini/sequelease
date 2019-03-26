import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Popup } from 'semantic-ui-react';

const resultRenderer = ({ title }) => {
  return <Label content={title} />;
};
export default class TableSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      results: [],
      first: true,
    };
  }

  componentDidMount() {
    this.resetComponent();
    //this.setState({ value: this.props.selectedTable });

    const searchBar = document.getElementById(
      `search-bar-table-${this.props.rowIndex}`
    );
    searchBar.focus();
    searchBar.blur();
  }

  resetComponent = () =>
    this.setState({
      isLoading: true,
      results: [],
      first: true,
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

      const re = new RegExp(_.escapeRegExp(this.props.tableText), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.resultTables().map(tablename => {
            return { title: tablename };
          }),
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
            id={`search-bar-table-${this.props.rowIndex}`}
            input={{
              error: !this.props.tableTextInitial && this.props.tableTextError,
              icon: 'table',
            }}
            placeholder={`Choose Table ${this.props.rowIndex + 1}`}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            onFocus={(e, data) => {
              this.handleSearchChange(e, data);
              console.log('focus');
            }}
            onBlur={(e, data) => {
              if (!this.state.first) {
                this.props.query.from.fromJoinRows[
                  this.props.rowIndex
                ].tableTextInitial = false;
                this.handleSearchChange(e, data);
              } else {
                this.props.query.from.fromJoinRows[
                  this.props.rowIndex
                ].tableTextInitial = true;
                this.setState({ first: false });
              }
              console.log('blur');
            }}
            onMouseDown={(e, data) => {
              this.handleSearchChange(e, data);
              console.log('click');
            }}
            results={results}
            value={this.props.tableText}
            minCharacters={0}
          />
        }
        content={this.props.tableTextText}
        horizontalOffset={!this.props.tableTextText ? -10000 : 0}
        position="top center"
        aligned="left"
        on={['focus', 'hover', 'click']}
      />
    );
  }
}
