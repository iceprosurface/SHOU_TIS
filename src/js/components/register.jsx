/**************************
 * @author icepro
 * @time 2016/12/13. 14:07:05 +UTC 08:00
 * @update 2016/12/13. 14:06:46 +UTC 08:00
 ******************************/
import React from 'react'
import {
    render,
    findDOMNode
} from 'react-dom'
import {
    TableParser
} from '../components/TableParser.jsx';
import {
    Input,
    Textarea,
    FileInput,
    CheckBoxs,
    Select
} from "../components/formItems.jsx";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalFooter,
    Button,
    ButtonGroup,
    Overlay,
    Alert
} from "react-Bootstrap";
import {
    json
} from "../util/fetchUtil.js"
import {
    fetchData
} from "../util/ajax.js";
export class Register extends React.Component {
    constructor(props) {
        super(props);
    }
    close() {
        this.props.onClose(false);
    }
    onSubmitFn(form) {
        var form = new FormData(form);
        fetchData("regist", {
            body: form
        }).then(json, function(e) {
			console.log(e);
            return Promise.reject();
        }).then((data) => {
			console.log(data);
			this.props.onSubmitSuccess();
        });
    }
    render() {
        let data = [{
            elem: Input,
            validate: `^[\\d\\w]{4,12}$`,
            name: "usrname",
            label: "用户名",
            tips: "4-12位字母或数字",
            required: true,
        }, {
            elem: Input,
            validate: `^[\\d\\w]{6,12}$`,
            name: "password",
            label: "密码",
            tips: "6-12位字母或数字",
            required: true,
            psw: true,
        }, {
            elem: Input,
            validate: `^\\d{2}$`,
            name: "age",
            label: "年龄",
            tips: "年龄必须是两位数字",
            required: true,
            psw: false
        },{
            elem: Input,
            validate: `^\\d{6,12}$`,
            name: "sid",
            label: "学号或者工号",
            tips: "学号或者工号必须全部是数字",
            required: true,
            psw: false
        }
        ];
        const wellStyles = {
            maxWidth: 600,
            margin: '0 auto 10px'
        };
        return (
            <Modal show={this.props.isOpen} onHide={this.close.bind(this)}>
				<Modal.Header>
					<Modal.Title>注册</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="well" style={wellStyles}>
					<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
					</div>
				</Modal.Body>
			</Modal>
        )
    }
}
