import React, { useState } from 'react';
import './App.css';
import OptimizedComponent from "./components/OptimizedComponent";
import ComponentWithWarnings from "./components/ComponentWithWarnings";

function App() {
  const [showOptimized, setShowOptimized] = useState<boolean>(false);

  return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => setShowOptimized(!showOptimized)}>
            {showOptimized ? 'Show Component with Warnings' : 'Show Optimized Component'}
          </button>
          {showOptimized ? <OptimizedComponent /> : <ComponentWithWarnings />}
        </header>
      </div>
  );
}

export default App;
