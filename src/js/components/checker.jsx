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
		this.state = {
			dangerMode: false
		}
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
        let warn = !this.state.dangerMode ? (<Alert bsStyle="warning" >警告：审查者的权限水平相当高，在默认情况下请不要随意给予用户审查者权限<Button onClick={()=>this.setState({dangerMode:true})}  bsStyle="danger" bsSize="xsmall">开启</Button></Alert>):(<Alert bsStyle="danger">警告：您现在开启了赋予危险权限的模式<Button bsStyle="primary" bsSize="xsmall" onClick={()=>this.setState({dangerMode:false})}>关闭</Button></Alert>);
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