/**************************
 * *@author icepro
 * @time 2016/11/8 20:40:53 +UTC 08:00
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
    Glyphicon
} from "react-Bootstrap"

const wellStyles = {
    maxWidth: 400,
    margin: '0 auto 10px'
};
class InputButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
			value:props.value
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
        return (
            <div className={cssTop}>
			<span className="input-group-addon"><Glyphicon glyph={this.props.glyph} /></span>
			<input type="text" className="form-control" name={this.props.name} placeholder={this.props.placeholder} onFocus={this.onFocused.bind(this)} onBlur={this.onblured.bind(this)} value={this.state.value} onChange={this.handleChange.bind(this)}	/>
		</div>)
    }
}
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			showModal: false,
			loginInfo:{
				'usr':'',
				'psw':'',
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
			loginInfo: Object.assign(this.state.loginInfo,item)
        });
    }
    render() {
        const popover = (
            <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
        );
        const tooltip = (
            <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
        );
        return (
            <div>
				<ButtonGroup bsStyle="primary" bsSize="large">
					<Button bsStyle="primary" onClick={this.open.bind(this)} ><Glyphicon glyph="user" />登录</Button>
					<Button bsStyle="primary"><Glyphicon glyph="pencil"/>注册</Button>
				</ButtonGroup>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header>
            <Modal.Title>登录</Modal.Title>
          </Modal.Header>
          <Modal.Body>
			  <div className="well" style={wellStyles}>
				  <InputButton name="usr"  value={this.state.loginInfo.usr} glyph="user" placeholder="please" changedValue={this.inputValue.bind(this)}/>
				<br/>
				<InputButton name="psw"  value={this.state.loginInfo.psw} glyph="lock" placeholder="please" changedValue={this.inputValue.bind(this)}/>
				<br/>
				<Button bsStyle="primary" bsSize="large" block>登录</Button>
				<Button bsStyle="primary" bsSize="large" block>忘记密码</Button>
				<Button bsSize="large" block onClick={this.close.bind(this)}>取消</Button>
			  </div>
          </Modal.Body>
        </Modal>
      </div>
        );
    }
}
