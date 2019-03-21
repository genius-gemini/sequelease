import React, { Component } from 'react';

import Routes from './routes';

import ConsoleTable from './components/ConsoleTable';
import Navbar from './components/navBar';
import StepSQL from './components/stepSQL';
import FromDetail from './components/FromDetail';
import SelectDetail from './components/SelectDetail';
import WhereDetail from './components/WhereDetail';
import Db from './classes/db';
import Query from './classes/query';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { db: null, query: null, queryResults: null };
  }

  componentDidMount = async () => {
    const db = await Db.build();
    const query = Query.build(db);

    this.setState({ db, query });
  };

  updateQueryState = () => {
    this.setState({ query: { ...this.state.query } });
    console.log(this.state.query);
  };
  /*
  runQuery = async () => {
    const res = await axios.post('/api/queries/run', {
      query: this.state.query,
    });
    const queryResults = res.data;

    console.log(queryResults);

    this.setState({ queryResults });
  };
  */
  render() {
    if (this.state.db) {
      return (
        <div>
          <div>
            <Navbar />
            <Routes />
            <StepSQL />
            <FromDetail
              db={this.state.db}
              query={this.state.query}
              updateQueryState={this.updateQueryState}
            />

            <SelectDetail
              query={this.state.query}
              updateQueryState={this.updateQueryState}
            />

            <WhereDetail
              query={this.state.query}
              updateQueryState={this.updateQueryState}
            />
          </div>
          <div>
            <button /*onClick={this.runQuery}*/ type="button">Run Query</button>
          </div>

          <div id="consoleBox">
            <ConsoleTable query={this.state.query} />
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default App;
