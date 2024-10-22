import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateRule from './components/CreateRule';
import RuleList from './components/RuleList';
import CombineRules from './components/CombineRules';
import EvaluateRule from './components/EvaluateRule';
import ModifyRule from './components/ModifyRule';
import './App.css'; 

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <div className="header">
            <img src="/algorithm (3).png" alt="Logo" className="logo" />
            <h2>Rule Engine with AST</h2>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/">Create Rule</Link>
              </li>
              <li>
                <Link to="/rules">Rule List</Link>
              </li>
              <li>
                <Link to="/combine">Combine Rules</Link>
              </li>
              <li>
                <Link to="/evaluate">Evaluate Rule</Link>
              </li>
              <li>
                <Link to="/modify">Modify Rule</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<CreateRule />} />
            <Route path="/rules" element={<RuleList />} />
            <Route path="/combine" element={<CombineRules />} />
            <Route path="/evaluate" element={<EvaluateRule />} />
            <Route path="/modify" element={<ModifyRule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

