/**************************
 * *@author icepro
 * @time 2016/11/9 21:50:53 +UTC 08:00
 * @update 2016/11/13. 21:52:07 +UTC 08:00
 * ****************************/
import React from 'react'
import {
    render
} from 'react-dom';
import {
	Form
} from 'react-Bootstrap';
import {
	Input
} from '../components/formItems.jsx';

export class TableParser extends React.Component {
    render() {
        let row = [],
            datas = this.props.datas;
        for (let i in datas) {
			row.push(React.createElement(datas[i].elem,datas[i]))
        }
        return (
            <div>
				<Form horizontal>
					{row}
					<input type="submit"/>
				</Form>
			</div>
        )
    }
}
