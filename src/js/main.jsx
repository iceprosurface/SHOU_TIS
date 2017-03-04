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
	hashHistory,
	IndexRoute
} from 'react-router';
// 导入react-bootstrap相关组件简化开发难度
import {
	Alert,
	NavbarHeader,
	Navbar,
	MenuItem,
	NavItem,
	Nav,
	NavbarBrand,
	NavDropdown,
	Col,
	Row,
	Grid,
	PageHeader,
	small,
} from "react-Bootstrap";
// 导入自己写的相关组件
import Login from "./components/login.jsx"

import {
	LoadingModal
} from "./components/modal.jsx"

// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
	addTargetListener
} from "./util/message.js"
import {
	json
} from "./util/fetchUtil.js"
import {
	fetchData
} from "./util/ajax.js"
import {
	getCookie,
	delCookie
} from "./util/cookie.js"
import {
	ProjectCreate,
	ProjectList,
	ProjectEdit
} from "./components/project.jsx"

import {
	ProgressList,
	ProgressShow
} from "./components/progress.jsx"
import {
	updateData,
	NoticeCreate,
	NoticeList,
	NoticeShow,
	NoticeDisplay,
	NoticeLink,
	NoticeInvite,
	NoticeOther,
	NoticeSystem,
} from './components/notice.jsx'

import {
	AdminProjectChecker,
	AdminProjectModify,
	AdminUsrChecker,
	AdminLogin,
	AdminLogined,
	AdminUsrVal
} from './components/admin.jsx'

import {
	PeopleNav,
	PeopleInfo,
	PeopleSecret
} from './components/people.jsx'
import {
	CheckerLogin,
	CheckerLogined,
	ProjectCheck,
	UsrCheck,
	MidCheck,
	EndCheck,
	processEnd
} from './components/checker.jsx'
// pre-defined params use
updateData();

// 对默认的时间格式作出扩展
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

const Check = React.createClass({
	getInitialState() {
		return {};
	},
	render() {
		return (
			<div>
				{/*<p>this is checkers</p>*/}
				{this.props.children}
			</div>
		)
	}
})
const Admin = React.createClass({
	getInitialState() {
		return {};
	},
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
})
const App = React.createClass({
	getInitialState() {
		var state = {
			logined: false
		};
		addTargetListener('logined', (value, name) => {
			this.setState({
				logined: value,
				name: name
			});
			hashHistory.push('/');
			// window.location.href = "/";
		});
		fetchData('tokenLogin')
			.then(json, (e) => {
				throw new Error(e)
			})
			.then((data) => {
				this.setState({
					logined: true,
					name: data.name
				});
			}).catch((e) => {
				console.log(e);
			});
		return state;
	},

	render() {
		let loginOut = function () {
			delCookie('logined');
			this.setState({
				logined: false
			});
			hashHistory.push("/");
		}
		let usrcon;
		// 登录状态下切换显示名字
		if (!this.state.logined) {
			usrcon = <Login />;
		} else {
			usrcon = <span onClick={loginOut.bind(this)}>{this.state.name}</span>
		}

		// add an offset for main body in order to make it have some blank to nav bar
		const bodyCss = {
			'marginTop': '90px'
		}
		return (
			<div>
				<LoadingModal />
				<Navbar fixedTop inverse>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">shou</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem eventKey={1} href="#/people">用户信息</NavItem>
						<NavDropdown eventKey={2} title="科研项目" id="basic-nav-dropdown">
							<MenuItem eventKey={2.1} href="#/project/create">新建科研项目</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={2.2} href="#/project/list/1">科研项目预览</MenuItem>
						</NavDropdown>
						<NavDropdown eventKey={3} title="切换模式" id="basic-nav-dropdown">
							<MenuItem eventKey={3.1} href="#/checker/logined">审查者模式</MenuItem>
							<MenuItem eventKey={3.2} href="#/admin/logined">浏览模式</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.3} href="#/admin/logined">管理者模式</MenuItem>
						</NavDropdown>
					</Nav>
					<Nav pullRight>
						{/*<NavItem eventKey={3} href="#/notice"><NoticeDisplay></NoticeDisplay></NavItem>*/}
						<NavItem eventKey={4} href="#">{usrcon}</NavItem>
					</Nav>
				</Navbar>
				<div className="container" style={bodyCss}>{this.props.children}</div>
			</div>
		)
	}
})

const Home = React.createClass({
	// 仅仅做测试
	render() {
		return (
			<div>
				<h3>欢迎来到科研项目管理系统</h3>
				<hr />
				<Alert>如果您的左上角没有显示出名字或者名字后缀带有游客的话说明您现在处于游客身份，游客只能浏览无法操作任何项目</Alert>
				<p>
					欢迎您来到科研项目管理系统，这里你可以对科研项目作出审批查询，以及操作。
				</p>
				<p>
					在使用前我们希望你能先阅读一下以下流程：
				</p>
				<ol className="ol-pd30">
					<li>首先你需要登录或者注册一个账号</li>
					<li>申请具体的审批者或者项目管理者</li>
					<li>等待审核</li>
					<li>创建一个项目或者开始审批项目</li>
				</ol>	
			</div>
		);
	}
})
const Project = React.createClass({
	// 仅仅做测试
	render() {
		return (
			<div>
				<h3>科研项目管理</h3>
				<hr />
				{this.props.children}
			</div>
		);
	}
})

//<!-- <div className='uil-reload-css'><div></div></div> -->
const People = React.createClass({
	// 仅仅做测试
	render() {
		return (
			<div>
				<h2>this is a people control</h2>
				{this.props.children}
			</div>
		)
	}
})
// TODO<icepro:2016/12/07. 15:24:24>:it should be add an callback for fetch data on notice
const Notice = React.createClass({
	render() {
		return (
			<div>
				<PageHeader>通知提醒</PageHeader>
				<Grid>
					<Row>
						<Col md={2}><NoticeLink></NoticeLink></Col>
						<Col md={10}>{this.props.children}</Col>
					</Row>
				</Grid>
			</div>
		)
	}
})
const Test = React.createClass({

	submits() {

		var form = new FormData(this.refs.forms);
		fetch("/file/upload", { method: "POST", body: form }).then(function () {
		}).catch(function (e) {
			console.lod(e);
		});
	},
	render() {
		return (
			<div>
				<form ref="forms" method="post" enctype="multipart/form-data">
					<input type="file" name="upload" />
				</form>
				<button onClick={this.submits.bind(this)}>提交</button>
			</div>
		)
	}
});

const BadPath = React.createClass({
	render() {
		return (
			<div>
				<h2>当前路径未能查找到</h2>
			</div>
		)
	}
})
const NotLogin = React.createClass({
	render() {
		return (
			<div>
				<h2>尚未登录</h2>
			</div>
		)
	}
})
const Test = React.createClass({

	submits(){
		
        var form = new FormData(this.refs.forms);
		fetch("/file/upload", {method:"POST",body:form}).then(function(){
		}).catch(function(e){
			console.lod(e);
		});
	},
	render() {
		return(
			<div>
				<form ref="forms" method="post" enctype="multipart/form-data">
					<input type="file" name="upload"/>
				</form>
				<button onClick={this.submits.bind(this)}>提交</button>
			</div>
		)
	}
});

render((
	<Router history={hashHistory}>
		<Router path="/checker" component={Check}>
			<Router path="login" component={CheckerLogin}>
			</Router>
			<Router path="logined" component={CheckerLogined}>
				<Router path="project" component={ProjectCheck} />
				<Router path="usr" component={UsrCheck} />
				<Router path="mid" component={MidCheck} />
				<Router path="end" component={EndCheck} />
				<Router path="processEnd" component={processEnd} />
			</Router>
		</Router>
		<Router path="/admin" component={Admin}>
			<Router path="logined" component={AdminLogined}>
				<Router path="projectCheck" component={AdminProjectChecker} />
				<Router path="usrCheck" component={AdminUsrChecker} />
				<Router path="usrVal" component={AdminUsrVal} />
				<Router path="AdminProjectModify" component={AdminProjectModify} />
			</Router>
			<Router path="login" component={AdminLogin}></Router>
		</Router>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="people" component={PeopleNav}>
				<Route path="info" component={PeopleInfo} />
				<Route path="secret" component={PeopleSecret} />
			</Route>
			<Route path="project" component={Project}>
				<Route path="create" component={ProjectCreate} />
				<Route path="list/:page" component={ProjectList} />
				<Route path="manage">
					<Route path="edit/:pid" component={ProjectEdit} />
					<Route path="midterm" component={ProjectList} />
					<Route path=":pid/progress/list/:page" component={ProgressList} />
					<Route path=":pid/progress/:progressId" component={ProgressShow} />
					<Route path="endProject" component={ProjectList} />
				</Route>
			</Route>
			<Route path="notice" component={Notice}>
				<Route path="invite/:page" component={NoticeInvite} />
				<Route path="other/:page" component={NoticeOther} />
				<Route path="system/:page" component={NoticeSystem} />
				<Route path="show" component={NoticeShow} />
			</Route>
			<Route path="test" component={Test}>
			</Route>
			<Route path="NotLogin" component={NotLogin}>
			</Route>
			<Route path="*" component={BadPath}>
			</Route>
		</Route>
	</Router>
), document.getElementById("context"))
