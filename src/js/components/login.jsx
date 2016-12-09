/**************************
 * *@author icepro
 * @time 2016/11/8 20:40:53 +UTC 08:00
 * @update 2016/11/18. 16:13:35 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    Popover,
    Tooltip,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalFooter,
    Button,
    ButtonGroup,
    Glyphicon,
	Overlay,
	Alert
} from "react-Bootstrap"
import {
    ReactDOM
} from 'react-dom'

import {
    emitTarget
} from "../util/message.js"
import {
	fetchData
} from "../util/ajax.js"
import {
    json
} from "../util/fetchUtil.js"

const wellStyles = {
    maxWidth: 400,
    margin: '0 auto 10px'
};

const Tips = React.createClass({
  render() {
      return (
		  <Alert bsStyle="danger">
			  <p>你的用户名或密码可能错误</p>
		  </Alert>
      );
  },
});

class InputButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            value: props.value
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
    handleChange(event) {
        this.setState({
            value: event.target.value
        });
        let item = {};
        item[this.props.name] = event.target.value;
        this.props.changedValue(item);
    }
    render() {
        let focused = this.state.focused;
        let cssTop = `input-group ${focused?'focus':''}`;
        let inputType = this.props.type == 'psw' ? 'password' : 'text';
        return (
            <div className={cssTop}>
				<span className="input-group-addon"><Glyphicon glyph={this.props.glyph} /></span>
				<input type={inputType} className="form-control" name={this.props.name} placeholder={this.props.placeholder} onFocus={this.onFocused.bind(this)} onBlur={this.onblured.bind(this)} value={this.state.value} onChange={this.handleChange.bind(this)}	/>
			</div>
        )
    }
}
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showtips: false,
            showModal: false,
            loginInfo: {
                'usr': '',
                'psw': '',
            }
        };
    }
    close() {
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    }
    inputValue(item) {
        this.setState({
            loginInfo: Object.assign(this.state.loginInfo, item)
        });
    }
    login() {
		var form = new FormData(this.loginForm);
		fetchData('login',{body:form})
			.then(json, (e) => {
				this.setState({
					tipshow: true
				});
				return Promise.reject();
			})
			.then((data) => {
				// 呼叫事件表达目前已经登录
				emitTarget('logined', true, data.name);
			}).catch(function(e) {});
	}
	openDialog() {
		emitTarget('loadingOpen');
	}
	// TODO : <icepro:2016.10.18>添加提示栏
    render() {
        const tips = this.state.tipshow ? <Tips></Tips> : '';
        return (
            <div>
				<ButtonGroup bsStyle="primary" bsSize="xs">
					<Button bsStyle="primary" onClick={this.open.bind(this)} ><Glyphicon glyph="user" />登录</Button>
					<Button bsStyle="primary" onClick={this.openDialog.bind(this)} ><Glyphicon glyph="pencil"/>注册</Button>
				</ButtonGroup>
				<Modal show={this.state.showModal} onHide={this.close.bind(this)}>
					<Modal.Header>
						<Modal.Title>登录</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="well" style={wellStyles}>
							{tips}
							<form ref={(form) => this.loginForm = form }>
								<InputButton name="usr"  value={this.state.loginInfo.usr} glyph="user" placeholder="请输入用户名" changedValue={this.inputValue.bind(this)}/>
								<br/>
								<InputButton name="psw" type="psw"  value={this.state.loginInfo.psw} glyph="lock" placeholder="请输入密码" changedValue={this.inputValue.bind(this)}/>
							</form>
							<br/>
							<Button bsStyle="primary" bsSize="large" block onClick={this.login.bind(this)} >登录</Button>
							<Button bsStyle="primary" bsSize="large" block>忘记密码</Button>
							<Button bsSize="large" block onClick={this.close.bind(this)}>取消</Button>
						</div>
					</Modal.Body>
				</Modal>
			</div>
        );
    }
}
