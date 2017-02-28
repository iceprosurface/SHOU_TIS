/**************************
 * *@author icepro
 * @create  2017.2.25. 22:56:09 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    hashHistory
} from 'react-router';
import {
	TableParser
} from '../components/TableParser.jsx';
import {
	FormControl,
	FormGroup,
	ControlLabel,
	Table,
	Accordion,
	Panel,
	ListGroup,
	ListGroupItem,
	Grid,
	Row,
	Col,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalFooter,
    Button,
    ButtonGroup,
    Glyphicon,
    Alert,
	wellStyles,
} from "react-Bootstrap"
import {
    Input,
    Textarea,
    FileInput,
    CheckBoxs,
	Select
} from "../components/formItems.jsx"
import {
    fetchData
} from "../util/ajax.js"
import {
    json
} from "../util/fetchUtil.js"
import {
    getCookie,
	delCookie
} from "../util/cookie.js"
import {
    InputButton
} from "../components/admin.jsx";
// TODO: 整合成一个login组件
export class CheckerLogin extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			showLogin: true,
			warning: false
		}
	}
	login(){
		var formData = new FormData(this.refs.loginform);
		fetchData('checkerLogin', {
			body: formData
			})
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
				hashHistory.push('/checker/logined');
			},(code)=>{
				if(code.message == "403" || code.message == "402")
					this.setState({warning:true});
			})
			.catch((e) => {
				console.log(e);
			});

	}
	render(){
		let close = ()=>this.setState({showLogin: false});
		let tips = this.state.warning ? (
			<Alert bsStyle="danger">
				<p>你的用户名或密码错误，同时也可能你的账户不存在管理员权限。</p>
			</Alert>
		):'';
		return(
			<div>
				<Modal show={this.state.showLogin}>
					<Modal.Header>
						<Modal.Title>审查者登录</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="well" style={wellStyles}>
							{tips}
							<form ref="loginform">
								<InputButton name="usr" glyph="user" placeholder="请输入用户名"/>
								<br/>
								<InputButton name="psw" type="psw" glyph="lock" placeholder="请输入密码"/>
							</form>
							<br/>
							<Button bsStyle="primary" bsSize="large" block onClick={this.login.bind(this)} >登录</Button>
							<Button bsStyle="primary" bsSize="large" block>忘记密码</Button>
						</div>
					</Modal.Body>
				</Modal>

			</div>
			)
	}
}
export class CheckerLogined extends React.Component {
    constructor(props) {
        super(props);
    }
	render(){
        let loginOut = function(){
            delCookie('logined');
			hashHistory.push("/");
		}
		fetchData('checkerTokenLogin')
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
			},(code)=>{
				hashHistory.push('/checker/login');
			})
			.catch((e) => {
				console.log(e);
			});
		return(
            <Grid className="admin-content">
				<Row>
					<Col xs={6} md={3}>
						<Accordion>
							<Panel header="审查" eventKey="3">
								<p><a href="#/checker/logined/project">项目审批</a></p>
								<p><a href="#/checker/logined/usr">用户游客=>项目管理者审批</a></p>
								<p><a href="#/checker/logined/mid">中期检查审批</a></p>
								<p><a href="#/checker/logined/end">结题审批</a></p>
							</Panel>
							<Panel header="当前用户操作" eventKey="4">
								<p><a onClick={loginOut.bind(this)}>登出</a></p>
							</Panel>
						</Accordion>
					</Col>
					<Col xs={6} md={9}>
						{this.props.children}
					</Col>
				</Row>
			</Grid>
		)
	}
}

export class ProjectCheck extends React.Component {
    constructor(props) {
        super(props);
    }
	render(){
		return(
            <div>ProjectCheck
            </div>
		)
	}
}

export class UsrCheck extends React.Component {
    constructor(props) {
        super(props);
    }
	render(){
		return(
            <div>UsrCheck
            </div>
		)
	}
}

export class EndCheck extends React.Component {
    constructor(props) {
        super(props);
    }
	render(){
		return(
            <div>
            </div>
		)
	}
}
export class MidCheck extends React.Component {
    constructor(props) {
        super(props);
    }
	render(){
		return(
            <div>MidCheck
            </div>
		)
	}
}