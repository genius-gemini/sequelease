import React, { Component } from 'react';

import Routes from './routes';

import ConsoleTable from './components/ConsoleTable';
import Navbar from './components/navBar';
import OuterGrid from './components/outerGrid';
import Connect from './components/Connect';
import Db from './classes/db';
import Query from './classes/query';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { db: null, query: null, queryResults: null };

    this.connectToDb();
  }

  connectToDb = async (host, user, password, port, database) => {
    const db = await Db.build(host, user, password, port, database);
    const query = Query.build(db);
    this.setState({ db, query });
  };

  updateQueryState = () => {
    this.setState(prevState => ({ query: { ...prevState.query } }));
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
        <div style={{ marginBottom: '1000px' }}>
          <div>
            <Navbar />
            <Connect connectToDb={this.connectToDb} />
            <OuterGrid
              db={this.state.db}
              query={this.state.query}
              updateQueryState={this.updateQueryState}
            />
            <Routes />

            {/*
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
            />*/}
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
