/**************************
 * *@author icepro
 * @create 2016/11/25. 21:19:22 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    hashHistory
} from 'react-router';
import {
    render
} from 'react-dom';
import {
    Alert,
	Table,
	Button,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalFooter
} from 'react-Bootstrap';
import {
    TableParser
} from '../components/TableParser.jsx';
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

export class ProjectCreate extends React.Component {
	constructor(props) {
        super(props);
		this.state = {
			tipshow:false
		}
	}
    onSubmitFn(form) {
        var formData = new FormData(form);
        fetchData('projectCreate', {
                body: formData
            })
            .then(json, (e) => {
                return Promise.reject(e);
            })
            .then((data) => {
				hashHistory.push('/project/manage/edit/'+formData.get("projectid"));
			},(code)=>{
				this.setState({tipshow:true});
				
			})
            .catch((e) => {
                console.log(e);
            });
    }
    render() {
		let close = ()=>this.setState({show:false});
        let data = [{
            elem: Input,
            validate: `^\\d+$`,
            name: "projectid",
            label: "项目id",
            tips: "项目id必须是数字",
            required: true,
		},{
            elem: Input,
            name: "projectName",
            label: "项目的基本名称",
            required: true,
        },{
            elem: Textarea,
            name: 'info',
            placeholer: '请输入',
            label: '项目基本信息'
        }];
		const tips = this.state.tipshow ? (
			<Alert bsStyle="danger">
				<p>你的id可能是重复值，如果确信你的id值是独立的，请联系管理员解决</p>
			</Alert>
		): '';
        return (
            <div>
				{ tips }
				<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
			</div>
        )
    }
}
export class ProjectEdit extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			list : {},
			/* 0 代表正常，1代表staff模式 */
			editType: 0,
			show: false,
			modalData: []
		}
		// 获取相关数据
        fetchData('projectSingle',{data:[this.props.params.pid]})
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list	
				});
			})
			.catch(function(error){
				console.warn(error);
			});
		// 这里是用来显示pid
		// this.props.params.page
    }
    onSubmitFn(form) {
        var form = new FormData(form);
		if(this.state.editType !== 0){
			fetchData("projectEditStaff", {
				body: form,
				data:[this.props.params.pid]
			}).then(json, function(e) {
				console.log(e);
				return Promise.reject();
			}).then((data) => {
				console.log(data);
			});
		}else{
			fetchData("projectEdit", {
				body: form,
				data:[this.props.params.pid]
			}).then(json, function(e) {
				return Promise.reject();
			}).then((data) => {
				this.setState({
					list:Object.assign(this.state.list,data.list),
					show: false
				})	
			});
		}
    }
	edit(type){
		var data = [
			{
				elem: type=="information"?Textarea:Input,
				disabled: true,
				name: type,
				label: type,
				required: true,
				value: this.state.list[type]
			},{
				elem: type=="information"?Textarea:Input,
				name: type,
				label: "修改值",
				required: true,
			}
		];
		this.setState({
			show: true,
			editType: 0,
			modalData: data
		});
		return false;
	}
	staffEdit(staffObject){
		var data = [
			{
				elem: Input,
				disabled: true,
				name: "staffOld",
				label: "旧人员信息",
				required: true,
				value: staffObject.name + "#" + staffObject._id
			},{
				elem: Input,
				name: "staffNew",
				label: "新人员",
				required: true,
			}
		];
		this.setState({
			show: true,
			editType: 1,
			modalData: data
		});
		return false;
	}
	render() {
		let rows = [];
		let list = this.state.list;
		let staffsRows = [];
		let data = this.state.modalData;
		if(list.staffs && list.staffs.length > 0 ){
			for(let i = 0 ;i < list.staffs.length ; i++){
				staffsRows.push(
						<tr className="row" key={"staff-" + i.toString()} >
							<td className="cell-ms-3"></td>
							<td className="cell-ms-6">{list.staffs[i].name}#{list.staffs[i]._id}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" onClick={this.staffEdit.bind(this,list.staffs[i])} >修改</Button></td>
						</tr>
				)
			}	
		}
		let close = ()=> this.setState({ show:false , editType : 0});
		return (
			<div>
				<Button bsStyle="primary">新增员工</Button>
				<hr />
				<Table>
					<tbody>
						<tr className="row">
							<th>名称</th>
							<th>详情</th>
							<th>操作</th>
						</tr>
						<tr className="row">
							<td className="cell-ms-3">系统管理员</td>
							<td className="cell-ms-6">{list.adminUsrChief ? list.adminUsrChief.name:""}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" onClick={this.staffEdit.bind(this,list.adminUsrChief)}>修改</Button></td>
						</tr>
						<tr className="row">
							<td className="cell-ms-3">名称</td>
							<td className="cell-ms-6">{list.name}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" onClick={this.edit.bind(this,"name")}>修改</Button></td>
						</tr>
						<tr className="row">
							<td className="cell-ms-3">项目建立时间</td>
							<td className="cell-ms-6">{list.createTime}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" disabled>修改</Button></td>
						</tr>
						<tr className="row">
							<td className="cell-ms-3">项目概况</td>
							<td className="cell-ms-6">{list.information? list.information:""}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" onClick={this.edit.bind(this,"information")}>修改</Button></td>
						</tr>
						<tr className="row">
							<td className="cell-ms-3">项目人数</td>
							<td className="cell-ms-6">{list.staffs? list.staffs.length:""}</td>
							<td className="cell-ms-3"><Button bsStyle="primary" disabled>修改</Button></td>
						</tr>
						{ staffsRows }
					</tbody>
				</Table>
				<Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">修改内容</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={close}>Close</Button>
					</Modal.Footer>
				</Modal>			
			</div>
		);
	}
}

export class ProjectList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			list: []
		}

        fetchData('projectList', {
				data:[this.props.params.page]
            })
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list	
				});
			})
			.catch(function(error){
				console.warn(error);
			});

	}
	redirectEdit(pid) {
		window.location.href = "#/project/manage/edit/" + pid;
	}
    render() {
		let rows = [];
		let list = this.state.list;
		for(let i = 0 ;i < list.length ; i++){
			rows.push(	
				<tr>
					<td>{list[i].pid}</td>
					<td>{list[i].name}</td>
					<td>{list[i].createTime}</td>
					<td>{list[i].endTime}</td>
					<td>
						<Button bsStyle="primary" onClick={this.redirectEdit.bind(this,list[i].pid)}>修改</Button>
						<Button bsStyle="primary" onClick={this.redirectEdit.bind()}>提交中期检查</Button>
						<Button bsStyle="primary" onClick={this.redirectEdit.bind()}>提交项目进度</Button>
						<Button bsStyle="primary" onClick={this.redirectEdit.bind()}>申请结题</Button>
					</td>
				</tr>
			);
		}	
        return (
            <div>
				<p>this is project List</p>
				<Table>
					<thead>
						<tr>
							<th>pid</th>
							<th>name</th>
							<th>创建时间</th>
							<th>结束时间</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
			</div>
        )
    }
}
