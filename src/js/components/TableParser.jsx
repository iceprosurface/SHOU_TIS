/**************************
 * *@author icepro
 * @time 2016/11/9 21:50:53 +UTC 08:00
 * @update 2016/11/13. 21:52:07 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    render,
	findDOMNode
} from 'react-dom';
import {
    Form,
	Button
} from 'react-Bootstrap';

export class TableParser extends React.Component {
    constructor(props) {
        super(props);
    }
	onSubmitFn(event){
		// 外部访问接口用来处理表单提交事件

		var forms = findDOMNode(this.refs.form);
		if(forms.checkValidity()){
			this.props.onSubmitFn(forms);

		}
		event.preventDefault(); 
		return false;
	}	
	callSubmit(){
		findDOMNode(this.refs.form).submit();
	}
    render() {
        let row = [],
            datas = this.props.datas;
        for (let i in datas) {
            datas[i].key = i
            row.push(React.createElement(datas[i].elem, datas[i]))
        }

		let midButtonStyle = {'textAlign':'center'};

        return (
            <div>
				<Form horizontal ref="form" onSubmit={this.onSubmitFn.bind(this)}>
					{row}
					<div style={midButtonStyle}>
						<input className="btn btn-primary" type='submit' value="提交"/>
					</div>
				</Form>
			</div>
        )
    }
}
