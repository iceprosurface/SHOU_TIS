/**************************
 * *@author icepro
 * @create  2017.1.30. 13:06:07 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    hashHistory
} from 'react-router';
import {
	TableParser
} from '../components/TableParser.jsx';
import {
    Pagination,
    Alert,
	Table,
	Button,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalFooter
} from 'react-Bootstrap';
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

// 用来显示progress进度的组件
export class ProgressList extends React.Component {
	constructor(props) {
        super(props);
		this.state = {
			total: 0,
			page: this.props.params.page,
			list: [],
			show:false,
			modalData: [],
		}
		this.initData(this.state.page);
	}
	initData(page){
		fetchData('progressList', {
				data:[parseInt(this.props.params.pid),page]
            })
            .then(json, (e) => {
                return Promise.reject(new Error(e));
            })
            .then((data) => {
				this.setState({
					list:data.list,
					total:data.total,
					page:data.page,
					show:false
				});
			})
			.catch(function(error){
				console.warn(error);
			});
	}
	handleSelect(eventKey) {
		hashHistory.push(`/project/manage/${this.props.params.pid}/progress/list/${eventKey}`);
		this.initData(eventKey);
    }
	createProgress(){
		var data = [
			{
				elem: Input,
				name: "name",
				label: "进度名称",
				tips:"进度名称必须填写",
				required: true
			},{
				elem: Textarea,
				name: "info",
				label: "简略信息"
			},{
				elem: FileInput,
				label: "文件",
				name: "upload"
			}
		];
		this.setState({
			show: true,
			modalData:data
		});
	}

    onSubmitFn(form) {
        var form = new FormData(form);
        fetchData('progressCreate', {
				body: form,
				data: [ this.props.params.pid]
            })
            .then(json, (e) => {
                return Promise.reject(e);
            })
            .then((data) => {
				this.setState({
					show:false
				});
				this.initData(this.props.params.page);
			},(code)=>{
				console.log(code);
				if(code.message == "403")
					this.setState({warning:true});
				if(code.message == "401")
					this.setState({tipshow:true});
				
			})
            .catch((e) => {
                console.log(e);
			});

	}
	downloadFile(fileId){
		window.location="/progress/"+fileId; 
	}
	render(){
		let rows = [];
		let list = this.state.list;
		for(let i = 0 ;i < list.length ; i++){
			let downloadButton = list[i].haveFiles? (<Button bsStyle="primary" onClick={this.downloadFile.bind(this,list[i]._id)}>下载文件</Button>):'';
			rows.push(	
				<tr key={"project-list-" + i.toString()}>
					<td>{list[i].name}</td>
					<td>{new Date(list[i].createTime).Format("yyyy-MM-dd")}</td>
					<td>
						<Button bsStyle="primary">查看</Button>
						{downloadButton}
					</td>
				</tr>
				);
		}	

		if(list.length <= 0){
			
		}

		const tips = this.state.tipshow ? (
			<Alert bsStyle="danger">
				<p>你的请求非法。</p>
			</Alert>
		): '';
		const warning = this.state.warning ? (
			<Alert bsStyle="danger">
				<p>当前project状态不允许创建progress 或 当前用户登录失效，如果登录状态下且应当出在project活动状态下，请联系admin。</p>
			</Alert>
		):'';
		let data = this.state.modalData;
		let close = ()=> this.setState({ show:false , editType : 0});
		return (
            <div>
				<div><h3>项目id号：{this.props.params.pid}<Button bsStyle="primary" onClick={this.createProgress.bind(this)}>提交项目最新进度</Button></h3></div>
				<Table>
					<thead>
						<tr>
							<th>阶段报告名称</th>
							<th>创建时间</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
				<Pagination bsSize="small" items={Math.ceil(this.state.total / 5)} maxButtons={5} activePage={parseInt(this.state.page)} onSelect={this.handleSelect.bind(this)} />
				<Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">新增进度</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{warning}
						{tips}
						<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={close}>Close</Button>
					</Modal.Footer>
				</Modal>			
			</div>
		)
	}
}
