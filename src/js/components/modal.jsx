import React from 'react'
import {
    render
} from 'react-dom';

import {
    Button,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalFooter,
} from 'react-Bootstrap';

// 导入监听者组件-用于响应事件的发生以回流state状态更新
import {
    addTargetListener
} from "../util/message.js"

export class LoadingModal extends React.Component {
    constructor(props) {
        super(props);

        // 监听loading open事件
        addTargetListener('loadingOpen', () => {
            this.setState({
                showLoading: true
            });
        });

        // 监听loading close事件
        addTargetListener('loadingClose', () => {
            this.setState({
                showLoading: false
            });
        });

        this.state = {
            showLoading: false
        };
    }
    close() {
        this.setState({
            showLoading: false
        });
    }
    open() {
        this.setState({
            showLoading: true
        });
    }
    render() {
        return (
            <div>
				<Modal show={this.state.showLoading} backdrop={true}>
					<Modal.Header>
						<Modal.Title>请稍等数据传送中</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{'textAlign':'center'}}>
						<div className='uil-reload-css' style={{display:'inline-block'}}><div></div></div>
						<p>如果长期没有反应，你可以尝试刷新页面来重试</p>
					</Modal.Body>
				</Modal>
			</div>
        )
    }
}
