import React from 'react';
import ConsoleTable from './components/ConsoleTable';
import Navbar from './components/navBar';
import StepSQL from './components/stepSQL';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <div>
        <Navbar />
        <Routes />
        <StepSQL />
      </div>
      <div id='consoleBox'>
        <ConsoleTable />
      </div>
    </div>
  );
};

export default App;
