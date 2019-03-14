import React from 'react';
import { Menu, Container, Header, Step } from 'semantic-ui-react';
import FromDetail from './FromDetail';

const StepSQL = () => (
  <Container id="cont" text style={{ marginTop: '7em' }}>
    <Header as="h1">SQLEase Query Visualizer</Header>
    <Step.Group ordered>
      <Step completed>
        <Step.Content>
          <Step.Title>FROM</Step.Title>
          <Step.Description>
            Choose the tables with the columns you want
          </Step.Description>
          {/* <div className="ui container">
              <div className="ui search">
                <input className="prompt" type="text" placeholder="Search" />
                <div className='results'></div>
              </div>
            </div>
            <script>
              var content = [
                  {title: 'Semantic UI',
                  description: 'Best UI Framework out there'},
                  {title: 'Something Else',
                  description: 'Best UI Framework out there'},
                  {title: 'An even other one',
                  description: 'Best UI Framework out there'},
                  {title: 'Angular JS',
                  description: 'Best UI Framework out there'}
              ];
              $('.ui.search').search()
            </script> */}
        </Step.Content>
      </Step>

      <Step active>
        <Step.Content>
          <Step.Title>SELECT</Step.Title>
          <Step.Description>
            Select the columns to include in your output
          </Step.Description>
        </Step.Content>
      </Step>

      <Step disabled>
        <Step.Content>
          <Step.Title>WHERE</Step.Title>
          <Step.Description>Select what you want to filter by</Step.Description>
        </Step.Content>
      </Step>
    </Step.Group>

    <FromDetail />
  </Container>
);

export default StepSQL;
