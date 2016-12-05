import React from 'react'
import {
    render
} from 'react-dom';

import {
    Grid,
    Col,
    Row

} from 'react-Bootstrap';

// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
    addTargetListener
} from "../util/message.js"

export class NoticeCreate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

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

        )
    }
}
export class NoticeDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

        )
    }
}

exports {
    NoticeCreate,
    NoticeList,
    NoticeShow,
    NoticeDisplay
}
