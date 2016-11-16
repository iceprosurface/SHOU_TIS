/**************************
 * *@author icepro
 * @time 2016/11/6 18:44:33 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    render
} from 'react-dom';
import {
    Router,
    Route,
    Link,
    hashHistory
} from 'react-router';

import {
    NavbarHeader,
    Navbar,
    MenuItem,
    NavItem,
    Nav,
    NavbarBrand,
    NavDropdown,
} from "react-Bootstrap";

import Login from "./components/login.jsx"

const bodyCss = {
	'marginTop': '90px'
}
const App = React.createClass({
    render() {
        return (
			<div>
				<Navbar fixedTop inverse>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">SHOU</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem eventKey={1} href="#/people">用户信息</NavItem>
						<NavItem eventKey={2} href="#/project">科研项目</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem eventKey={3} href="#"><Login /></NavItem>
					</Nav>
				</Navbar>
				<div className="container" style={bodyCss}>{this.props.children}</div>
			</div>
        )
    }
})
const Project = React.createClass({
    render() {
        return <h3>this is a project</h3>
    }
})

const People = React.createClass({
    render() {
        return (
            <div>
				<div className='uil-reload-css'><div></div></div>
				  <h2>this is a people control</h2>
			</div>
        )
    }
})
render((
    <Router history={hashHistory}>
		<Route path="/" component={App}>
		  <Route path="people" component={People} />
		  <Route path="project" component={Project}>
		  </Route>
		</Route>
	</Router>
), document.getElementById("context"))
