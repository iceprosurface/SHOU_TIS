import React from 'react'
import {
    render
} from 'react-dom';
import {
    Router,
    Route,
    Link,
    hashHistory
} from 'react-router';
import {
    TableParser
} from "./components/TableParser.jsx"
import {
	Input,
	CheckBoxs,
	Select
} from "./components/formItems.jsx"
const data = [{
    elem: Input,
    validate: `^\\d{7,20}`,
    name: "user",
    label: "用户名",
    tips: "用户名必须是7-20位的数字",
    required: true
}, {
    elem: Input,
    validate: `^\\d{7,20}`,
    name: "psw",
    label: "密码",
    tips: "密码必须是7-20位的数字",
    required: true,
    psw: true
}, {
    elem: Select,
    name: "gander",
    label: '性别',
    values: ['男', '女']
}];
//    type: "Check",
//    name: "marry",
//    label: "婚姻"
//}, {
//    type: "Select",
//    name: "education",
//    label: '教育',
//    labels: ['高一', '高二']
//}, {
//    type: "Select",
//    name: "education",
//    label: '教育',
//    labels: ['高一', '高二']
//}, ];
render((<TableParser datas={data}/>), document.getElementById("context"));
