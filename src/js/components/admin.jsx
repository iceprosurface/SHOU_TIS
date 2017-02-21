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
			<Grid className="admin-content">
				<Row>
					<Col xs={6} md={3}>
						<Accordion>
							<Panel header="项目" eventKey="1">
								<p><a href="#/admin/logined/projectCheck">审核信息变更</a></p>
								<p><a href="#/admin/logined/AdminProjectModify">项目信息变更</a></p>
							</Panel>
							<Panel header="用户" eventKey="2">
								<p><a href="#/admin/logined/usrCheck">用户个人信息变更</a></p>
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
		this.state = {
			status: 0 ,
			dataInfoShow: false,
			infoShow: false,
			sidIllagel: false,
		}
	}
	validate(event){
		var key = event.key;
		if(key == "Enter"){
			var pid = event.target.value.toString();
			if(pid.match(/^\d+$/g)){
				this.setState({
					sidIllagel: false,
					infoShow: false,
					dataInfoShow:false
				});
				this.findProject.call(this,pid);
			}else{
				this.setState({
					sidIllagel: true,
					infoShow: false,
					dataInfoShow:false
				});
			}
		}
	}
	findProject(pid){
		fetchData('adminGetProjectStatusByPid',{
				data:[pid]
			})
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
				this.setState({
					status: data.list.nowStatus,
					dataInfoShow:true,
					pid: pid
				});
			},(code)=>{
				this.setState({
					infoShow: true,
					pid: pid
				});
			})
			.catch((e) => {
				console.log(e);
			});

	}
	render(){
		let nowStatus = this.state.dataInfoShow?(
				<FormGroup controlId={this.props.name}>
					<Col componentClass={ControlLabel} sm={2}>
						项目的进度
					</Col>
					<Col sm={10}>
						<FormControl componentClass="select" defaultValue={this.state.status} placeholder={this.props.label}>
							<option key={1} value="0">项目创建阶段</option>
							<option key={2} value="1">创建审核阶段</option>
							<option key={3} value="2">创建审核失败</option>
							<option key={4} value="3">答辩阶段</option>
							<option key={5} value="4">答辩失败</option>
							<option key={6} value="5">进行中</option>
							<option key={7} value="6">终止审核</option>
							<option key={8} value="7">终止阶段</option>
							<option key={9} value="8">中期检查未通过</option>
							<option key={10} value="9">项目结题中</option>
						</FormControl>
					</Col>
				</FormGroup>
		):'';
		let tips = this.state.sidIllagel?(<Row><Alert bsStyle="danger">项目id必须是数字</Alert></Row>):'';
		let info = this.state.infoShow?( <Row><Alert bsStyle="danger">查无此id</Alert></Row>):'';
		return(
			<div>
				<Alert>在这里可以对项目进行进度调整并制定项目的审核计划.</Alert>
				{tips}
				{info}
				<Row>
					<Col  sm={2} md={2}>
						<label htmlFor="">项目id*</label>
					</Col>
					<Col  sm={10} md={10}>
						<input type="text" name="sid" required="" value={this.state.sid} onKeyPress={this.validate.bind(this)} placeholder="项目id必须是数字" pattern="^\d+$" title="项目id必须是数字" id="sid" className="form-control"/>
					</Col>
				</Row>
				{nowStatus}
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
			sidIllagel: false,
			show: false,
			data: {},
			dataInfoShow:false,
			pid:''
		}
	}
	onSubmitFn(){
		this.setState({
			show: true,
			data:{}
		});	
	}
	editProject(){
		var form = new FormData(this.refs.operation);
		fetchData('adminEditProject',{
				body: form,
				data: [this.state.pid]
			})
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
				this.setState({
					data: {},
					dataInfoShow:false
				});
			},(code)=>{
			})
			.catch((e) => {
				console.log(e);
			});

	}
	findProject(pid){
		fetchData('adminGetProjectByPid',{
				data:[pid]
			})
			.then(json, (e) => {
				return Promise.reject(e);
			})
			.then((data) => {
				this.setState({
					data: data.list,
					dataInfoShow:true,
					pid: pid
				});
			},(code)=>{
				this.setState({
					infoShow: true,
					pid: pid
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}
	validate(event){
		var key = event.key;
		if(key == "Enter"){
			var pid = event.target.value.toString();
			if(pid.match(/^\d+$/g)){
				this.setState({
					sidIllagel: false,
					infoShow: false,
					dataInfoShow:false
				});
				this.findProject.call(this,pid);
			}else{
				this.setState({
					sidIllagel: true,
					infoShow: false,
					dataInfoShow:false
				});
			}
		}
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
		let tips = this.state.sidIllagel?(<Row><Alert bsStyle="danger">项目id必须是数字</Alert></Row>):'';
		let info = this.state.infoShow?( <Row><Alert bsStyle="danger">查无此id</Alert></Row>):'';
		let project = this.state.data;
		let projectInfo = this.state.dataInfoShow?(
				<Row>
					<form ref="operation">
						<Table>
							<tbody>
								<tr>
									<th>名称</th>
									<th>值</th>
								</tr>
								<tr>
									<td>管理员用户</td>
									<td><input defaultValue={project.adminUsrChief._id} className="form-control" name="adminUsrChief"/></td>
								</tr>
								<tr>
									<td>基本信息</td>
									<td><textarea defaultValue={project.information} className="form-control"  name="information"></textarea></td>
								</tr>
								<tr>
									<td>创建时间</td>
									<td><input className="form-control"  type="date" defaultValue={project.createTime.substring(0,10)} name="createTime"/></td>
								</tr>
								<tr>
									<td>项目名称</td>
									<td><input defaultValue={project.name} className="form-control"  name="name"/></td>
								</tr>
							</tbody>
						</Table>
						<Button bsStyle="primary" onClick={this.editProject.bind(this)}>提交</Button>
					</form>
				</Row>):'';
		return(
			<div>
				{tips}
				{info}
				<Row>
					<Col  sm={2} md={2}>
						<label htmlFor="">项目id*</label>
					</Col>
					<Col  sm={10} md={10}>
						<input type="text" name="sid" required="" value={this.state.sid} onKeyPress={this.validate.bind(this)} placeholder="项目id必须是数字" pattern="^\d+$" title="项目id必须是数字" id="sid" className="form-control"/>
					</Col>
				</Row>
				{projectInfo}
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





