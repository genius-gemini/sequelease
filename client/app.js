import React, { Component, createRef } from "react";
import {
  Container,
  Menu,
  Segment,
  Sidebar,
  Ref,
  Button,
} from "semantic-ui-react";

import Routes from "./routes";

import ConsoleTable from "./components/ConsoleTable";
import Navbar from "./components/navBar";
import OuterGrid from "./components/outerGrid";
import Connect from "./components/Connect";
import Db from "./classes/db";
import Query from "./classes/query";
import AccordionNested from "./components/accordionNested";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null,
      error: false,
      query: null,
      showTable: false,
      visible: false,
      dbName: "tutorial-sql",
      host: null,
      user: null,
      password: null,
      port: null,
      database: null,
    };

    this.connectToDb();
  }

  segmentRef = createRef();
  handleShowClick = () => {
    this.state.visible
      ? this.setState({ visible: false })
      : this.setState({ visible: true });
  };
  handleSidebarHide = () => this.setState({ visible: false });

  connectToDb = async (host, user, password, port, database) => {
    const db = await Db.build(host, user, password, port, database);

    this.setState({ host, user, password, port, database });

    if (db.error) {
      this.setState({ error: true });
    } else {
      const query = Query.build(db);
      this.setState({ db, query, error: false });
    }
  };

  updateQueryState = () => {
    this.setState(prevState => ({ query: { ...prevState.query } }));
    console.log(this.state.query);
  };

  runQuery = async () => {
    const { host, user, password, port, database } = this.state;
    let query = await this.state.query.getQueryResults(
      host,
      user,
      password,
      port,
      database,
    );

    this.setState({ query, showTable: true });
  };

  clearQuery = () => {
    this.setState({ query: Query.build(this.state.db) });
  };

  showTable = () => {
    this.setState(prevState => ({ showTable: !prevState.showTable }));
  };

  setDbName = name => {
    this.setState({ dbName: name });
  };

  render() {
    const { visible } = this.state;

    if (this.state.db) {
      return (
        <div>
          <div>
            <Sidebar.Pushable style={{ minHeight: "100vh" }} as={Segment}>
              <Sidebar
                as={Menu}
                animation="push"
                icon="labeled"
                inverted
                direction="left"
                onHide={this.handleSidebarHide}
                vertical
                visible={visible}
                width="wide"
                target={this.segmentRef}
              >
                <AccordionNested
                  dbName={this.state.dbName}
                  db={this.state.db}
                />
              </Sidebar>

              <Sidebar.Pusher>
                <Navbar
                  visible={visible}
                  handleShowClick={this.handleShowClick}
                />
                <Connect
                  setDbName={this.setDbName}
                  error={this.state.error}
                  connectToDb={this.connectToDb}
                />
                <OuterGrid
                  db={this.state.db}
                  query={this.state.query}
                  updateQueryState={this.updateQueryState}
                />
                <Routes />
                {/* <StepSQL />
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
                    /> */}
                <div
                  style={{
                    marginLeft: "55px",
                    marginRight: "5px",
                    display: "inline-block",
                  }}
                >
                  <Button.Group size="mini">
                    <Button positive onClick={this.runQuery}>
                      Run Query
                    </Button>
                    <Button.Or />
                    <Button color="red" onClick={this.clearQuery}>
                      Clear Query
                    </Button>
                  </Button.Group>
                  {/* <button onClick={this.runQuery} type="button">
                    Run Query
                  </button> */}
                </div>
                {/*
                <div style={{ display: 'inline-block' }}>
                  <button onClick={this.clearQuery} type="button">
                    Clear Query
                  </button>
                </div> */}

                <div id="consoleBox">
                  <Ref innerRef={this.segmentRef}>
                    <ConsoleTable
                      visible={this.state.visible}
                      showTable={this.state.showTable}
                      query={this.state.query}
                    />
                  </Ref>
                </div>
                <div
                  onClick={this.showTable}
                  style={{
                    marginBottom: "30px",
                    marginRight: "30px",
                    right: 0,
                    cursor: "pointer",
                    bottom: 0,
                    position: "fixed",
                    padding: "5px",
                    paddingLeft: "7px",
                    paddingRight: "7px",
                    backgroundColor: "black",
                    borderRadius: "3px",
                    color: "white",
                  }}
                >
                  {this.state.showTable ? "Hide" : "Show"} Table
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default App;
