/**************************
 * *@author icepro
 * @time 2016/11/6 18:44:33 +UTC 08:00
 * @update 2016/11/22. 10:50:06 +UTC 08:00
 * ****************************/
// 导入react 以及相关组件
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
// 导入react-bootstrap相关组件简化开发难度
import {
    NavbarHeader,
    Navbar,
    MenuItem,
    NavItem,
    Nav,
    NavbarBrand,
    NavDropdown,
} from "react-Bootstrap";
// 导入自己写的相关组件
import Login from "./components/login.jsx"
// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
    addTargetListener
} from "./util/message.js"

import {
	getCookie
} from "./util/cookie.js"

const App = React.createClass({
    getInitialState() {
		var state = {
			logined :false
        };
        addTargetListener('logined', (value,name) => {
			this.setState({logined:value,name:name});
        });
		return  state;
	},

    render() {
        let usrcon ;
		// 登录状态下切换显示名字
		// TODO <icepro 2016.11.22>: 个人信息的修改选项-dropdown
		if(!this.state.logined){
			usrcon=<Login />;
		}else{
			usrcon = <span>{this.state.name}</span>
		}
		// 设置一个上方的偏移，使得navbar和container有一定的距离
		const bodyCss = {
			'marginTop': '90px'
		}
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
						<NavItem eventKey={3} href="#">{usrcon}</NavItem>
					</Nav>
				</Navbar>
				<div className="container" style={bodyCss}>{this.props.children}</div>
			</div>
        )
    }
})
const Project = React.createClass({
	// 仅仅做测试
    render() {
        return <h3>this is a project</h3>
    }
})

const People = React.createClass({
	// 仅仅做测试
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
