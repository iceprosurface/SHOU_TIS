/**************************
 * *@author icepro
 * @time 2016/11/8 21:50:53 +UTC 08:00
 * @update 2016/11/9. 10:54:17 +UTC 08:00
 * @update 2016/11/11. 10:54:17 +UTC 08:00
 * @update 2016/11/13. 21:52:07 +UTC 08:00
 * @update 2016/11/18. 16:14:00 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    render
} from 'react-dom';

import {
    Col,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-Bootstrap"
/*
 * this is a input component for table parser 
 * @prop required
 * whether the input is required
 * @prop psw 
 * should use password type
 * @prop validate 
 * validation
 * @prop label
 * show what is this input target
 * @prop tips
 * when illegal input,what should be display
 */
export class Input extends React.Component {
    render() {
        return (
            <div>
				<FormGroup controlId={this.props.name}>
					<Col componentClass={ControlLabel} sm={2}>
						{this.props.label}{this.props.required?'*':""}
					</Col>
					<Col sm={10}>
						<FormControl type={this.props.psw?'password':'text'} name={this.props.name} required={this.props.required?true:false} placeholder={this.props.tips} pattern={this.props.validate} title={this.props.tips}/>
					</Col>
				</FormGroup>
			</div>
        )
    }
}
/**
 * this is just use for one check box for table parser 
 * if you want to use a check box for multi-diplay 
 * perhaps following class Select will performs well in fact
 * In any other way,use Checkbox inline <react-bootstrap> instead
 */
export class Check extends React.Component {
	render() {
		return (
			<FormGroup controlId={this.props.name}>
				<Checkbox inline>
					{this.props.lable}
				</Checkbox>
			</FormGroup>
		)
	}
}
/**
 * a Select component 
 */
export class Select extends React.Component {

    render() {
		let datas = this.props.values;
		let row = [];
		for(let i in datas){
			row.push(
					<option key={i} value={datas[i]}>{datas[i]}</option>
			)
		}
		return (
			<FormGroup controlId={this.props.name}>
				<Col componentClass={ControlLabel} sm={2}>
					{this.props.label}
				</Col>
				<Col sm={10}>
					<FormControl componentClass="select" placeholder={this.props.label}>
						{row}
					</FormControl>
				</Col>
			</FormGroup>
		)

    }
}
//TODO:<icepro:2016.11.13>: should add textarea and muti-select 
export class Textarea extends React.Component {
	render(){
		return (
			<FormGroup controlId={this.props.name}>
				<Col componentClass={ControlLabel} sm={2}>
					{this.props.label}
				</Col>
				<Col sm={10}>
					<FormControl componentClass="textarea" name={this.props.name} placeholder={this.props.placeholer} />
				</Col>
			</FormGroup>
		)
	}
}

export class FileInput extends React.Component {
	render(){
		return (
			<FormGroup controlId={this.props.name}>
				<Col componentClass={ControlLabel} sm={2}>
					{this.props.label}
				</Col>
				<Col sm={10}>
					<FormControl type="file" componentClass="input"/>
				</Col>
			</FormGroup>
		)
	}
}

// TODO <icepro 2016-11-27>: 需要添加一个time的选择类型
