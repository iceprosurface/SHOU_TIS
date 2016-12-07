import React from 'react'
import {
    render
} from 'react-dom';

import {
    Badge,
    Grid,
    Col,
    Row,
    ListGroupItem,
    ListGroup,
} from 'react-Bootstrap';

// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
    addTargetListener
} from "../util/message.js"

// analog data for test
// TODO: it should be add a fetch data when system load it
var noticeData = {
    systemData: {
        length: 1
    },
    otherData: {
        length: 1
    },
    invitationData: {
        length: 0
    },
}
export class NoticeCreate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div></div>
        )
    }
}
export class NoticeList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let noticeList = [];
        for (let i = 0; i < this.data.length; i++) {
            noticeList.push(
                <Row>
					<Col md={2}></Col>
					<Col md={10}></Col>
				</Row>
            )
        }
        return (
            <div>
				<Grid>
				</Grid>
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
            <div></div>
        )
    }
}

export class NoticeDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1
        }
    }
    render() {
        return (
            <div>消息<Badge>{noticeData.systemData.length+ noticeData.otherData.length + noticeData.invitationData.length}</Badge></div>
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
					<ListGroupItem  disabled={noticeData.systemData.length==0} href="#">系统消息<Badge>{noticeData.systemData.length}</Badge></ListGroupItem>
					<ListGroupItem disabled={noticeData.invitationData.length==0} href="#">项目邀请 <Badge>{noticeData.invitationData.length}</Badge></ListGroupItem>
					<ListGroupItem disabled={noticeData.otherData.length==0} href="#">其他消息<Badge>{noticeData.otherData.length}</Badge></ListGroupItem>
				</ListGroup>
			</div>

        )
    }
}

export {
    NoticeCreate,
    NoticeList,
    NoticeShow,
    NoticeDisplay,
    NoticeLink
}
