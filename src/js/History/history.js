import React from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/es/FormControl";
import Row from "react-bootstrap/Row";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            search: ''
        }
    }

    componentDidMount() {
        let that = this;
        if (this.props.getUser().userid !== '') {
            axios({
                method: 'get',
                url: 'http://10.132.140.56:23333/files/list',
                params: {
                    uuid: this.props.getUser().userid,
                },
            })
                .then(function (data) {
                    let array = data.data.data;
                    if (array.length !== 0) {
                        that.setState({
                            history: array,
                        })
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    downloadFile (event,id,name){
        event.stopPropagation();
        event.preventDefault();
        axios({
            url: 'http://10.132.140.56:23333/files/download/'+id,
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

    deleteFile (event, id) {
        event.stopPropagation();
        event.preventDefault();
        let r = window.confirm("确认删除?");
        let that = this;

        if(r){
            axios({
                method: 'post',
                url: 'http://10.132.140.56:23333/files/delete',
                params: {
                    reportId: id,
                },
            })
                .then(function (data) {
                    if (data.data.code !== 200)
                        alert(data.data.message);
                    else{
                        that.removeFile(id);
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    removeFile(id){
        let history = this.state.history;

        for (var i = 0; i < history.length; i++) {
            if (history[i].reportId === id) {
                history.splice(i, 1);
                break;
            }
        }
        this.setState({
            history: history,
        })
    }

    changeUnit(size){
        if(size < 1024)
            return size+'B';
        else if(size < 1048576)
            return (size/1024).toFixed(1) + 'KB';
        else
            return (size/1048576).toFixed(1) + 'MB';
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSearch(event){
        event.preventDefault();
        event.stopPropagation();
        // TODO: 搜索
    }


    render() {
        const historyItems = this.state.history.map((history) => <Card body key={history.reportId} className="mt-lg-3" style={{width: '80%'}}>
            <h5>报告名称：{history.fileName}</h5>
            <span style={span_style}>生成时间：{history.createTime}</span>
            <span style={span_style}>文件大小：{this.changeUnit(history.size)}</span>
            {/*<Link style={span_style} to={{ pathname: '/historydetail', state: {id: history.reportId}}}>详情</Link>*/}
            <Button variant="primary" className="float-right" onClick={e=>this.downloadFile(e,history.reportId,history.fileName)}>下载</Button>
            <Button variant="danger" className="float-right mr-3" onClick={e=>this.deleteFile(e,history.reportId)}>删除</Button>
        </Card>);
        return (
            <Container className="mt-3">
                <Row className="justify-content-md-end">
                    <Form inline className="ml-4">
                        <FormControl type="text"
                                     className="mr-sm-2"
                                     name="search"
                                     value={this.state.search}
                                     onChange={e => this.handleChange(e)}/>
                        <Button variant="outline-primary" className="mr-2"
                                onClick={e => this.handleSearch(e)}>查找</Button>
                    </Form>
                </Row>
                {this.state.history.length === 0?(<p>您还没有检测记录</p>):(
                    <Row className="justify-content-md-center">
                        {historyItems}
                    </Row>
                )}
            </Container>
        );
    }
}

const span_style = {
    color: '#488fce',
    marginRight: '20px',
}

export default History;

