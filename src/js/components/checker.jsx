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
    Pagination
} from "react-bootstrap"
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
								<p><a href="#/checker/logined/processEnd">项目终止审批</a></p>
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
		// 1 代表创建分类， 3 代表答辩分类
		this.state = {
			mode: 1,
			page:0,
			detail: false,
			details: {}
		}
		this.initData();
    }
	lookProject(sid){
		fetchData('checkerProjectSingle',{
			data:[sid]
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					detail: true,
					details: data.list
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	checkData(sid,bool){
		var form = new FormData();
		form.append("result",bool);
		fetchData('checkerProject',{
			data:[sid],
			body: form
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.initData();
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	download(_id){
		window.location = `/check/project/${_id}/download`;
	}
	initData(){
		// 获取相关数据
        fetchData('checkPList',{
			data:[this.state.page,this.state.mode]
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list,
                    total:data.total,
					page:data.page
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	handleSelect(eventKey) {
		// hashHistory.push(`/project/list/${eventKey}`);
		// this.initData(eventKey);
        this.setState({
            page: eventKey,
        });
        this.initData();
    }
	render(){
		let rows = [];
        let list;
        if(this.state.list){
            list = this.state.list;
            for(let i = 0 ;i < list.length ; i++){
                rows.push(	
                    <tr key={"user-list-" + i.toString()}>
                        <td>{list[i].name}</td>
                        <td>{list[i].pid}</td>
                        <td>
                            <Button bsStyle="primary" onClick={this.lookProject.bind(this,list[i].pid)}>查看</Button>
                            <Button bsStyle="primary" onClick={()=>this.checkData(list[i].pid,true)}>通过</Button>
                            <Button bsStyle="danger" onClick={()=>this.checkData(list[i].pid,false)}>不通过</Button>
                        </td>
                    </tr>
                );
            }
        }
		let close = ()=>this.setState({detail:false});
		let details;
		if(this.state.details){
			let data = this.state.details;
			 details = (
				<div>
					<Table>
						<thead>
							<tr>
								<th>名字</th>
								<th>值</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>pid</td>
								<td>{data.pid}</td>
							</tr>
							<tr>
								<td>name</td>
								<td>{data.name}</td>
							</tr>
							<tr>
								<td>information</td>
								<td>{data.information}</td>
							</tr>
							<tr>
								<td>createTime</td>
								<td>{new Date(data.createTime).Format("yyyy-MM-dd")}</td>
							</tr>
							<tr>
								<td>是否下载文件</td>
								<td><Button bsStyle="primary" disabled={!data.haveFile} onClick={this.download.bind(this,data._id)}>下载文件</Button></td>
							</tr>
						</tbody>
					</Table>
				</div>
			)
		}
		return(
            <div>
				<h3>结题审批</h3>
				{/* 这里一定要用this.state 而不是 setState 因为setState需要下一个周期才能响应，而这个周期结束时候以及使用initData刷新 */}
				<Alert bsStyle="info">提示: 你可以选择其他的类别审批
					<FormControl componentClass="select" onChange={(e)=>{this.state.mode=e.target.value;this.state.page=1;this.initData();}}>
						<option value="1">初创阶段</option>
						<option value="3">答辩阶段</option>
					</FormControl>
				</Alert>
				<hr/>
                <Table>
					<thead>
						<tr>
							<th>名字</th>
							<th>id</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
                <Pagination bsSize="small" items={Math.ceil(this.state.total / 5)} maxButtons={5} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
				<Modal show={this.state.detail} onHide={close} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">详细信息</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{details}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={close}>Close</Button>
					</Modal.Footer>
				</Modal>	
            </div>
		)
	}
}

export class UsrCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        this.initData();
    }
	checkData(number,bool,type){
		var form = new FormData();
		form.append("result",bool);
		fetchData('checkerUsr',{
			data:[number,type],
			body:form
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.initData();
			})
			.catch(function(error){
				console.warn(error);
			});
	}
    initData(){
		// 获取相关数据
        fetchData('checkUList',{data:[this.state.page]})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list,
                    total:data.total,
					page:data.page
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	handleSelect(eventKey) {
		// hashHistory.push(`/project/list/${eventKey}`);
		// this.initData(eventKey);
        this.setState({
            page: eventKey,
        });
        this.initData();
    }
	render(){
        let rows = [];
        let list;
        if(this.state.list){
            list = this.state.list;
            for(let i = 0 ;i < list.length ; i++){
                rows.push(	
                    <tr key={"user-list-" + i.toString()}>
                        <td>{list[i].name}</td>
                        <td>{list[i].sid}</td>
                        <td>{list[i].age}</td>
                        <td>
                            <Button bsStyle="primary" onClick={()=>this.checkData(list[i].sid,true,0)}>通过项目管理者</Button>
                            <Button disabled={!this.state.dangerMode} bsStyle="warning" onClick={()=>this.checkData(list[i].sid,true,1)}>通过审查者权限</Button>
                            <Button disabled={!this.state.dangerMode} bsStyle="warning" onClick={()=>this.checkData(list[i].sid,true,2)}>通过双重权限</Button>
                            <Button bsStyle="danger" onClick={()=>this.checkData(list[i].sid,false,0)}>不通过</Button>
                        </td>
                    </tr>
                );
            }
        }
        let warn = !this.state.dangerMode ? (
			<Alert bsStyle="warning" >警告：审查者的权限水平相当高，在默认情况下请不要随意给予用户审查者权限<Button onClick={()=>this.setState({dangerMode:true})}  bsStyle="danger" bsSize="xsmall">开启</Button></Alert>
		):(
			<Alert bsStyle="danger">警告：您现在开启了赋予危险权限的模式<Button bsStyle="primary" bsSize="xsmall" onClick={()=>this.setState({dangerMode:false})}>关闭</Button></Alert>
		);
		return(
            <div>
				<h3>用户申请</h3>
				{warn}
				<hr/>
                <Table>
					<thead>
						<tr>
							<th>名字</th>
							<th>id</th>
							<th>年龄</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
                <Pagination bsSize="small" items={Math.ceil(this.state.total / 5)} maxButtons={5} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
            </div>
		)
	}
}

export class EndCheck extends React.Component {
	constructor(props) {
        super(props);
		// 1 代表创建分类， 3 代表答辩分类
		this.state = {
			mode: 1,
			page:0,
			total:0,
			detail: false,
			details: {}
		}
		this.initData();
    }
	lookProject(sid){
		fetchData('checkerProjectSingle',{
			data:[sid]
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					detail: true,
					details: data.list
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	initData(){
		// 获取相关数据
        fetchData('checkPList',{
			data:[this.state.page,9]
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list,
                    total:data.total,
					page:data.page
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}

	checkData(number,bool){
		var form = new FormData();
		form.append("result",bool);
		fetchData('checkerProject',{
			data:[number],
			body:form
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.initData();
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	handleSelect(eventKey) {
		// hashHistory.push(`/project/list/${eventKey}`);
		// this.initData(eventKey);
        this.setState({
            page: eventKey,
        });
        this.initData();
    }
	render(){
		let rows = [];
        let list;
        if(this.state.list){
            list = this.state.list;
            for(let i = 0 ;i < list.length ; i++){
                rows.push(	
                    <tr key={"user-list-" + i.toString()}>
                        <td>{list[i].name}</td>
                        <td>{list[i].pid}</td>
                        <td>
                            {/*<Button bsStyle="primary">查看</Button>*/}
                            <Button bsStyle="primary" onClick={()=>this.checkData(list[i].pid,true)}>通过</Button>
                            <Button bsStyle="danger" onClick={()=>this.checkData(list[i].pid,false)}>不通过</Button>
                        </td>
                    </tr>
                );
            }
        }
		return(
            <div>
				<h3>结题审批</h3>
				<Alert bsStyle="info">项目通过将会进入项目完成阶段，不通过则会选择回到进行状态。</Alert>
				<hr/>
                <Table>
					<thead>
						<tr>
							<th>名字</th>
							<th>id</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
                <Pagination bsSize="small" items={Math.ceil(this.state.total / 5)} maxButtons={5} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
            </div>
		)
	}
}
export class MidCheck extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			pid: "",
			none:false,
			noProcess:false,
			fail: false,
			detailDisplay: false
		}
	}
	findProgress(){
		return fetchData('findProgress',{
			data:[this.state.pid],
		})
            .then(json, (e) => {
				this.setState({
					noProcess:true,
				})
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				// debugger;
				this.setState({
					list:data.list,
					detailDisplay:true
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	find(){
		this.setState({
			none:false,
			noProcess: false,
			detailDisplay: false,
			fail: false,
			show:false,
			list: []
		})
		fetchData('checkerProjectExist',{
			data:[this.state.pid],
		})
            .then(json, (e) => {
				this.setState({
					none:true
				})
                return Promise.reject(new Error(e));
            })
            .then(this.findProgress.bind(this))
			.catch(function(error){
				console.warn(error);
			});
	}
	checkData(sid){
		fetchData('checkerMid',{
			data:[sid],
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				if(data.response == "fail"){
					this.setState({
						fail: true
					})
				}
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	lookProgress(pid){
		fetchData('findProgressSingle',{
			data:[pid],
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				if(data.response == "fail"){
					this.setState({
						fail: true
					})
				}else{
					this.setState({
						show: true,
						single: data.list
					})
				}
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	render(){
		let rows = [];
        let list;
        if(this.state.list){
            list = this.state.list;
            for(let i = 0 ;i < list.length ; i++){
                rows.push(	
                    <tr key={"user-list-" + i.toString()}>
                        <td>{list[i].name}</td>
                        <td>{list[i]._id}</td>
                        <td>{new Date(list[i].createTime).Format("yyyy-MM-dd")}</td>
                        <td>
                            <Button bsStyle="primary" onClick={this.lookProgress.bind(this,list[i]._id)}>查看</Button>
                        </td>
                    </tr>
                );
            }
        }
		let none = this.state.none ? (
			<Alert>查无此pid</Alert>
		):"";
		let noProcess = this.state.noProcess ? (
			<div>
				<Alert bsStyle="danger">没有查询到项目进度<Button bsStyle="danger" onClick={this.checkData.bind(this,this.state.pid)}>不通过中期检查</Button></Alert>
			</div>
		):"";

		let fail = this.state.fail ? (
			<Alert>你不能对一个已经完成或者处于监控状态的项目作出修改</Alert>
		):"";
		let details = this.state.detailDisplay ? (
			<div>
				<div>
					<Alert bsStyle="info">你可以选择关停项目<Button bsStyle="danger" onClick={this.checkData.bind(this,this.state.pid)}>不通过中期检查</Button></Alert>
				</div>
				<div>
					<Table>
						<thead>
							<tr>
								<th>名字</th>
								<th>id</th>
								<th>创建时间</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{rows}
						</tbody>
					</Table>
				</div>
			</div>
		):"";
		return(
            <div>
				<h4>项目中期检查</h4>
				<Alert bsStyle="info">项目中期检查可以选择查看项目的中期进度，如果项目进度很差，或者不提交中期检查报告，可以选择在这里关停项目</Alert>
				<hr/>
				<Row><Col xs={9}><FormControl onChange={(e)=>{this.setState({pid:e.target.value})}} className="primary"/></Col><Col xs={3}><Button bsStyle="primary" onClick={this.find.bind(this)}>查询进度</Button></Col></Row>
				<hr/>
				{none}
				{noProcess}
				{fail}
				{details}
				<Modal show={this.state.show} onHide={()=>this.setState({show:false})} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">详细信息</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					{this.state.single?(<Table>
						<thead>
							<tr>
								<th>名称</th>
								<th>值</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>操作者</td>
								<td>{this.state.single.operator.name}</td>
							</tr>
							<tr>
								<td>名称</td>
								<td>{this.state.single.info}</td>
							</tr>
							<tr>
								<td>创建时间</td>
								<td>{new Date(this.state.single.createTime).Format("yyyy-MM-dd")}</td>
							</tr>
							<tr>
								<td>文件</td>
								<td><Button onClick={()=>window.location="/checker/progress/"+this.state.single._id} bsStyle="primary" disabled={!this.state.single.haveFiles}>下载</Button></td>
							</tr>
						</tbody>
					</Table>):""}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={()=>this.setState({show:false})}>Close</Button>
					</Modal.Footer>
				</Modal>	
            </div>
		)
	}
}

export class processEnd extends React.Component {
	constructor(props) {
        super(props);
		this.state = {
			page:0,
			detail: false,
			details: {}
		}
		this.initData();
    }
	lookProject(sid){
		fetchData('checkerProjectSingle',{
			data:[sid]
		})
		.then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					detail: true,
					details: data.list
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	initData(){
		// 获取相关数据
        fetchData('checkPList',{
			data:[this.state.page,6]
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list,
                    total:data.total,
					page:data.page
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	handleSelect(eventKey) {
		// hashHistory.push(`/project/list/${eventKey}`);
		// this.initData(eventKey);
        this.setState({
            page: eventKey,
        });
        this.initData();
    }
	checkData(number,bool){
		var form = new FormData();
		form.append("result",bool);
		fetchData('checkerProject',{
			data:[number],
			body:form
		})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.initData();
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	render(){
		let rows = [];
        let list;
        if(this.state.list){
            list = this.state.list;
            for(let i = 0 ;i < list.length ; i++){
                rows.push(	
                    <tr key={"user-list-" + i.toString()}>
                        <td>{list[i].name}</td>
                        <td>{list[i].pid}</td>
                        <td>
                            {/*<Button bsStyle="primary">查看</Button>*/}
                            <Button bsStyle="primary" onClick={()=>this.checkData(list[i].pid,true)}>通过</Button>
                            <Button bsStyle="danger" onClick={()=>this.checkData(list[i].pid,false)}>不通过</Button>
                        </td>
                    </tr>
                );
            }
        }
		return(
            <div>
				<h3>项目终止审查</h3>
				<Alert bsStyle="info">项目终止审查阶段,通过则加入终止阶段，不通过则回到进行阶段。</Alert>
				<hr/>
                <Table>
					<thead>
						<tr>
							<th>名字</th>
							<th>id</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
                <Pagination bsSize="small" items={Math.ceil(this.state.total / 5)} maxButtons={5} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
            </div>
		)
	}
}