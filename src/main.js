import React, {useState, useEffect} from "react";
import {
	BrowserRouter,
	Switch,
	Route,
	Link
} from "react-router-dom";

import Home from "./home/home.js";
import About from "./about/about.js";
import SwitcherToggler from "./SwitcherToggler.js";

export default function App() {
	return (<Inards/>)
}

function Inards() {
  return (
	  <>
	  <SwitcherToggler/>
    <BrowserRouter basename="/">
      <div className='w-screen flex justify-center' data-testid="app">
	  <div className='w-1/2 flex flex-col space-y-12'>
        <nav>
          <ul className='w-full flex flex-row justify-around'>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
            <Home/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
        </Switch>

      </div>
	  </div>
    </BrowserRouter>
	  </>
  );
}
