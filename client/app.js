import React from 'react';

import { Navbar } from './components';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <h1>BOILERMAKER</h1>
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
