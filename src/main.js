import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import Home from "./home/home.js";
import About from "./about/about.js";

export default function App() {
  return (
    <Router>
      <div className='w-screen flex justify-center'>
	  <div className='w-1/2 flex flex-col space-y-12'>
        <nav>
          <ul className='w-full flex flex-row justify-around'>
            <li>
              <Link to="/typeracer2/">Home</Link>
            </li>
            <li>
              <Link to="/typeracer2/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/typeracer2/">
            <Home/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
        </Switch>

      </div>
	  </div>
    </Router>
  );
}
