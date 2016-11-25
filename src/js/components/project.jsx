/**************************
 * *@author icepro
 * @create 2016/11/25. 21:19:22 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    render
} from 'react-dom';
import {
} from 'react-Bootstrap';
import {
    TableParser
} from '../components/TableParser.jsx';
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

export class ProjectCreate extends React.Component {
	onSubmitFn(form){

	}
    render() {
        let data = [
            {
                elem: Input,
                validate: `^\\d+$`,
                name: "id",
                label: "项目id",
                tips: "项目id必须是数字",
                required: true,
            },
            {
                elem: Input,
                validate: `^\\d{2}$`,
                name: "age",
                label: "年龄",
                tips: "年龄必须是两位数字",
                required: true,
                psw: false
            },
            {
                elem: Textarea,
                name: 'info',
                placeholer: '请输入',
                label: '项目基本信息'
            }
        ];
        return (
            <div>
				<TableParser datas={data} onSubmitFn={this.onSubmitFn.bind(this)}/>
				<p>this is project create</p>
			</div>
        )
    }
}
export class ProjectList extends React.Component {
    render() {
        return (
            <p>this is project List</p>
        )
    }

}
