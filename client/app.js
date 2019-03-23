import React, { Component, createRef } from 'react';
import { Container, Menu, Segment, Sidebar, Ref} from 'semantic-ui-react'

import Routes from './routes';

import ConsoleTable from './components/ConsoleTable';
import Navbar from './components/navBar';
import StepSQL from './components/stepSQL';
import FromDetail from './components/FromDetail';
import SelectDetail from './components/SelectDetail';
import WhereDetail from './components/WhereDetail';
import Db from './classes/db';
import Query from './classes/query';
import AccordionNested from './components/accordionNested'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { db: null, query: null, queryResults: null, visible: false };
  }
  
  segmentRef = createRef()
  handleShowClick = () => {
    this.state.visible ? this.setState({ visible: false }) : this.setState({ visible: true })
  }
  handleSidebarHide = () => this.setState({ visible: false })

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
    const { visible } = this.state

    if (this.state.db) {
      return (
        <div>
          <div>
            <div>

              <Sidebar.Pushable as={Segment}>
                <Sidebar
                  as={Menu}
                  animation="push"
                  icon="labeled"
                  inverted
                  direction= "left"
                  onHide={this.handleSidebarHide}
                  vertical
                  visible={visible}
                  width="wide"
                  target={this.segmentRef}
                >
                  <AccordionNested />
                </Sidebar>

                <Sidebar.Pusher>
                  <Container id="flex-container">
                    <Navbar visible={visible} handleShowClick={this.handleShowClick} />
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
                    <div>
                      <button /*onClick={this.runQuery}*/ type="button">Run Query</button>
                    </div>
                  </Container>
                  <Ref innerRef={this.segmentRef}>
                    <div id="consoleBox">
                      <ConsoleTable query={this.state.query} />
                    </div>
                  </Ref>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default App;

