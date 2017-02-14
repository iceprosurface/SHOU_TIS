/**************************
 * *@author icepro
 * @create  2017.2.1. 22:56:09 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    hashHistory
} from 'react-router';
import {
	TableParser
} from '../components/TableParser.jsx';
import {
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

class InputButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
        };
    }
    onblured() {
        this.setState({
            focused: false
        });
    }
    onFocused() {
        this.setState({
            focused: true
        });
    }
    render() {
        let focused = this.state.focused;
        let cssTop = `input-group ${focused?'focus':''}`;
        let inputType = this.props.type == 'psw' ? 'password' : 'text';
        return (
            <div className={cssTop}>
				<span className="input-group-addon"><Glyphicon glyph={this.props.glyph} /></span>
				<input type={inputType} className="form-control" name={this.props.name} placeholder={this.props.placeholder} onFocus={this.onFocused.bind(this)} onBlur={this.onblured.bind(this)} />
			</div>
        )
    }
}


export class AdminLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showLogin: true,
			warning: false
		}
	}
	login(){
		var formData = new FormData(this.refs.loginform);
		fetchData('adminLogin', {
			body: formData
			})
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
				hashHistory.push('/admin/logined');
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
						<Modal.Title>登录</Modal.Title>
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

export class AdminLogined extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		fetchData('adminTokenCheck')
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
			},(code)=>{
				hashHistory.push('/admin/login');
			})
			.catch((e) => {
				console.log(e);
			});
		return(
			<Grid>
				<Row>
					<Col xs={6} md={3}>
						<Accordion>
							<Panel header="项目" eventKey="1">
								<p><a href="#/admin/logined/projectCheck">审核信息变更</a></p>
								<p><a href="#/admin/logined/AdminProjectModify">项目信息变更</a></p>
							</Panel>
							<Panel header="用户" eventKey="2">
								<p><a href="#/admin/logined/usrCheck">项目信息变更</a></p>
							</Panel>
							<Panel header="审查" eventKey="3">
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

export class AdminProjectChecker extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		return(
			<div>
				<p>this.is.admin.project.check</p> 
			</div>

		)
	}
}

export class AdminUsrChecker extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		return(
			<div>
				<p>this.is.AdminUsrChecker</p> 
			</div>
		)
	}
}

export class AdminProjectModify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			infoShow: false,
			show: true,
			data: {}
		}
	}
	onSubmitFn(){
		this.setState({
			show: true,
			data:[
			]
		});	
	}
	render(){
		var data = [{
            elem: Input,
            validate: `^\\d+$`,
            name: "sid",
            label: "项目id",
            tips: "项目id必须是数字",
            required: true,
		}];
		let close = ()=>this.setState({show: false});
		return(
			<div>
				<div> 
					<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
				</div>
				<div show={this.state.infoShow}> 

				</div>
				<Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">修改内容</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<TableParser datas={this.state.data} onSubmitFn={this.onSubmitFn.bind(this)}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={close}>Close</Button>
					</Modal.Footer>
				</Modal>			
			</div>

		)
	}
}





