/**************************
 * *@author icepro
 * @create  2017.2.3. 14:18:14 +UTC 08:00
 * ****************************/
import React from 'react'
import {
	hashHistory
} from 'react-router';
import {
	TableParser
} from '../components/TableParser.jsx';
import {
	Button,
	Alert,
	Table,
	Grid,
	Col,
	Row,
	ListGroupItem,
	ListGroup,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalFooter,
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

export class PeopleNav extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Grid>
				<Row>
					<Col xs={6} md={3}>
						<ListGroup>
							<ListGroupItem href="#/people/info">个人信息</ListGroupItem>
							<ListGroupItem href="#/people/secret">个人安全</ListGroupItem>
						</ListGroup>
					</Col>

					<Col xs={6} md={9}>
						{this.props.children}
					</Col>
				</Row>
			</Grid>
		)
	}
}

export class PeopleInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: {},
			show: false,
			warning: false,
			modalData: []
		}
		// 
		this.initData();
	}
	initData() {
		fetchData('myInfo')
			.then(json, (e) => {
				return Promise.reject(new Error(e));
			})
			.then((data) => {
				this.setState({
					list: data.list
				});
			})
			.catch(function (error) {
				console.warn(error);
			});
	}
	editAge(value) {
		var data = [
			{
				elem: Input,
				name: "age",
				label: "原年龄",
				value: this.state.list.age,
				required: true,
				disabled: true
			}, {
				elem: Input,
				validate: "^\\d{2}$",
				name: "age",
				label: "原年龄",
				tips: "年龄必须填写，且必须是2位整数",
				required: true,
			}
		];
		this.setState({
			show: true,
			modalData: data
		});
	}
	onSubmitFn(form) {
		var form = new FormData(form);
		fetchData("userAgeEdit", {
			body: form,
		}).then(json, function (code) {
			if (parseInt(code.message) == 401) {
				this.setState({ warning: true });
			}
			return Promise.reject();
		}).then((data) => {
			this.initData();
			this.setState({
				show: false
			});
		});
	}
	render() {
		let rows = [];
		let usrInfo = this.state.list;
		let data = this.state.modalData;
		let close = () => this.setState({ show: false });
		let warning = this.state.warning ? (
			<Alert bsStyle="danger">
				<p>你的id可能是重复值，如果确信你的id值是独立的，请联系管理员解决</p>
			</Alert>
		) : '';
		let permission = this.state.list.permission == "-1"?"待审核人员":["游客","项目管理者","审查者","项目管理者，审查者"][this.state.list.permission];
		permission = permission? permission:"管理员";
		return (
			<div>
				<Table>
					<tbody>
						<tr>
							<th>名称</th>
							<th>详情</th>
							<th>操作</th>
						</tr>
						<tr>
							<td>用户sid</td>
							<td>{this.state.list.sid}</td>
							<td><Button bsStyle="primary" disabled>修改</Button></td>
						</tr>
						<tr>
							<td>用户权限</td>
							<td>{permission}</td>
							<td><Button bsStyle="primary" disabled>修改</Button></td>
						</tr>
						<tr>
							<td>用户名称</td>
							<td>{this.state.list.name}</td>
							<td><Button bsStyle="primary" disabled>修改</Button></td>
						</tr>
						<tr>
							<td>年龄</td>
							<td>{this.state.list.age}</td>
							<td><Button bsStyle="primary" onClick={this.editAge.bind(this)}>修改</Button></td>
						</tr>
					</tbody>
				</Table>
				<Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">修改内容</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{warning}
						<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export class PeopleSecret extends React.Component {
	constructor(props) {
		super(props);
	}
	checkUser() {
		// 审查者用户的申请
		
	}
	nomalUser() {
		// 普通用户的申请
		fetchData("usrCheckerPut")
			.then(json, (e) => {
				return Promise.reject(new Error(e));
			})
			.then((data) => {
				hashHistory.push("people/info");
			})
			.catch(function (error) {
				console.warn(error);
			});
	}
	changePass() {

	}
	render() {
		return (
			<div>
				<h4>密码安全</h4>
				<hr />
				<Button bsStyle="primary" onClick={this.changePass.bind(this)}>修改密码</Button>
				<br />
				<br />
				<h4>用户申请</h4>
				<Alert>用户申请是指申请基本的用户使用权限包括创建项目等等，一个用户可以是普通用户也可以是一个审查者,这取决于审查者赋予你的权限</Alert>
				<hr />
				<Button bsStyle="primary" onClick={this.nomalUser.bind(this)}>提交申请</Button>
			</div>
		)
	}
}
