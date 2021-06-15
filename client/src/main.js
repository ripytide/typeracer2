import React, {createContext, useState} from 'react'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import About from './about/about.js'
import Home from './home/home.js'
import SwitcherToggler from './SwitcherToggler.js'
import themes from './themes.js'


const themeContext = createContext()
export {themeContext}

export default function App() {
	const [currTheme, changeTheme] = useState(themes[0])
	return (
		<themeContext.Provider value={{currTheme, changeTheme}}>
			<Inards />
		</themeContext.Provider>
	)
}

function Inards() {
	return (
		<>
			<SwitcherToggler />
			<BrowserRouter basename='/'>
				<div className='flex justify-center w-screen' data-testid='app'>
					<div className='flex flex-col w-1/2 space-y-12'>
						<nav>
							<ul className='flex flex-row justify-around w-full'>
								<li>
									<Link to='/'>Home</Link>
								</li>
								<li>
									<Link to='/about'>About</Link>
								</li>
							</ul>
						</nav>

						<Switch>
							<Route path='/'>
								<Home />
							</Route>
							<Route path='/about'>
								<About />
							</Route>
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		</>
	)
}
