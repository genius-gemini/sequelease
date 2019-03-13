import React from "react";

import Navbar from "./components/navBar";
import StepSQL from "./components/stepSQL";
import Routes from "./routes";

const App = () => {
  return (
    <div>
      <h1>BOILERMAKER</h1>
      <Navbar />

      <Routes />
      <StepSQL />
    </div>
  );
};

export default App;
