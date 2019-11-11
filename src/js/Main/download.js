import React from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Table} from "react-bootstrap";
import axios from "axios";
import Row from "react-bootstrap/Row";

class Download extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: props.getResult().result,
        }
    }


    download(event,id,name){
        event.stopPropagation();
        event.preventDefault();
        axios({
            url: 'http://10.141.222.205:23333/files/download/'+id,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const index = name.lastIndexOf('.');
            const newname = name.substr(0,index);
            link.setAttribute('download', newname+'_检测报告.html');
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }

    returnToFirst(event){
        event.preventDefault();
        event.stopPropagation();
        // 清除已选文档
        // uncheck 所有的实体
        let entityList = this.props.getStore().entityList;
        entityList.forEach(entity=>{
            entity.checked = false;
        })

        this.props.updateStore({
            files:[],
            entityList: entityList
        });

        // 清除result
        this.props.updateResult({
            result: []
        });

        this.props.jumpToStep(0);
    }

    render() {
        const results = this.state.result.map((result,index) => <tr key={result.id}>
            <td>{index+1}</td>
            <td>{result.name}</td>
            <td><Button onClick={e=>this.download(e,result.id, result.name)}>下载</Button></td>
        </tr>);

        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Table style={{width: '50%'}}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>文件名</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results}
                        </tbody>
                    </Table>
                </Row>
                <Row className="justify-content-md-end">
                    <Button onClick={e=>this.returnToFirst(e)}>返回首页</Button>
                </Row>
            </Container>
        );
    }
}

export default Download;