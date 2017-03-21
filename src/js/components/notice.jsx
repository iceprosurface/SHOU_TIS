import React from 'react'
import {
    render
} from 'react-dom';

import {
    Pagination,
    Panel,
    Glyphicon,
    Badge,
    Grid,
    Col,
    Row,
    ListGroupItem,
    ListGroup,
} from 'react-bootstrap';

import {
    fetchData
} from '../util/ajax.js'
// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
    addTargetListener
} from "../util/message.js"

// analog data for test
// TODO: it should be add a fetch data when system load it
var noticeData = {};
var noticeNumber = {};

export function updateData() {
	noticeNumber = {
		systemData: 1,
		otherData: 1,
		invitationData: 0,
	}
	return noticeNumber;
}

// this is a notice information for invitation (may send by system or any  other）
export class NoticeInvite extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
			<div>
				<NoticeList url='invite' data = { this.state.data } total = {this.state.total} page={this.props.params.page}  />
			</div>
        )
    }
}

// this a notice for other people or any other type of information
export class NoticeOther extends React.Component {
    constructor(props) {
        super(props);
        var headers = new Headers();
        var init = {
            method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default'
        };
		// this state must be add for
		this.state = {
			data:[],
			total:0,
		}

		// TODO: this should be get replace as otherData
		// fetch data  may fill in this area
        fetch('/js/test.json', init)
            .then(function(response) {
                return response.json();
            })
            .then((json) => {
				this.setState({data:json.response,total:Math.ceil(parseInt(json.total)/20)});
            });
    }
    render() {
        return (
            <div>
				<NoticeList url='other' data = { this.state.data } total = {this.state.total} page={this.props.params.page}  />
			</div>
        )
    }
}

// this is a notice component for system notice for user
export class NoticeSystem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>this is NoticeSystem</div>

        )
    }
}

export class NoticeCreate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
				<p>this is NoticeCreate</p>
			</div>
        )
    }
}

export class NoticeList extends React.Component {
    constructor(props) {
        // this.props.params.page
        super(props);
    }

    handleSelect(eventKey) {
        window.location.href = `/#/notice/${this.props.url}/${eventKey}`;
    }

    render() {
        let data = this.props.data;
        let total = this.props.total;
        let page = parseInt(this.props.page);
		if(page > total)
			page = total;
        let noticeList = [];
        for (let i = 0; i < data.length; i++) {
            noticeList.push(
                <Panel key={i} collapsible defaultExpanded header={ `${data[i].sender} | ${data[i].createTime }` }>
					<p>{data[i].information}</p>
				</Panel>
            )
        }
        return (
            <div>
				{noticeList}
				<Pagination bsSize="small" items={total} maxButtons={5} activePage={page} onSelect={this.handleSelect.bind(this)} />
			</div>
        )
    }
}
export class NoticeShow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
			<div>
			</div>
        )
    }
}

export class NoticeDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div><Glyphicon glyph="bell"></Glyphicon> <Badge>{noticeNumber.systemData + noticeNumber.otherData + noticeNumber.invitationData}</Badge></div>
        )
    }
}

export class NoticeLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
				<ListGroup>
					<ListGroupItem  disabled={noticeNumber.systemData==0} href="#/notice/system/1">系统消息<Badge>{noticeNumber.systemData}</Badge></ListGroupItem>
					<ListGroupItem disabled={noticeNumber.invitationData==0} href="#/notice/invite/1">项目邀请 <Badge>{noticeNumber.invitationData}</Badge></ListGroupItem>
					<ListGroupItem disabled={noticeNumber.otherData==0} href="#/notice/other/1">其他消息<Badge>{noticeNumber.otherData}</Badge></ListGroupItem>
				</ListGroup>
			</div>

        )
    }
}

//export {
//    NoticeCreate,
//    NoticeList,
//    NoticeShow,
//    NoticeDisplay,
//    NoticeLink
//}
