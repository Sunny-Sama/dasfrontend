import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import {Table} from "react-bootstrap";
import qs from 'qs';

class Detection extends React.Component {
    constructor(props) {
        super(props);

        let detectionState = [];
        const files = props.getStore().files;
        for(let i = 0; i < files.length; i++){
            detectionState.push({
                id: i,
                name: files[i].name,
                state: 0
            })
        }

        this.state = {
            files:  props.getStore().files,
            entityList: props.getStore().entityList,
            finished: false,
            detectionState: detectionState,
            disableButton: false,
        };

        this.isValidated = this.isValidated.bind(this);
    }

    stateMapping(state) {
        switch (state) {
            case 0:
                return "待检测";
            case 1:
                return "上传中";
            case 2:
                return "检测中";
            default:
                return "已完成";
        }
    }

    changeState(state){
        let detectionState = this.state.detectionState;
        detectionState.forEach(entity => {
            entity.state = state;
        });
    }

    updateDetectionID(files){
        let detectionState = this.state.detectionState;
        for(var i = 0; i < files.length; i++){
            for(var j = 0; j <files.length; j++){
                if(files[i].fileName === detectionState[j].name){
                    detectionState[j].id=files[i].reportId;
                }
            }
        }
        this.setState({detectionState: detectionState});
    }

    updateDetectionState(entities){
        let detectionState = this.state.detectionState;
        let all = true;
        for(var i = 0; i < entities.length; i++){
            if(entities[i].status === 1){
                for(var j = 0; j <detectionState.length; j++){
                    if(entities[i].reportId === detectionState[j].id){
                        detectionState[j].state=3;
                    }
                }
            }else{
                all = false;
            }
        }
        return all;
    }

    isValidated() {
        return this.state.finished;
    }

    getFileSize(){
        const files = this.state.files;
        let size = 0;
        for(var i = 0; i < files.length; i++){
            size+=files[i].size;
        }
        return size;
    }

    changeUnit(size){
        if(size < 1024)
            return size+'B';
        else if(size < 1048576)
            return (size/1024).toFixed(1) + 'KB';
        else
            return (size/1048576).toFixed(1) + 'MB';
    }

    getEntities(){
        const entities = this.state.entityList;
        let tmp = [];
        for(var i = 0; i < entities.length; i++){
            if(entities[i].checked)
                tmp.push(entities[i]);
        }

        let res;
        if(tmp.length === 0)
            return '';
        else
            res='，';

        for(i = 0; i < tmp.length-1; i++){
            res += tmp[i].name + '，';
        }

        res += tmp[tmp.length-1].name;
        return res;
    }


    // 上传并检测文件
    detection (event){
        event.preventDefault();
        event.stopPropagation();
        // disable按钮
        this.setState({disableButton: true});

        // 修改状态为上传中
       this.changeState(1);

        // 添加文件
        let fd = new FormData();
        let fileList = this.state.files;
        for(var i = 0; i < fileList.length; i++){
            fd.append("files", fileList[i]);
        }

        // 添加用户id
        fd.append("uuid", this.props.getStore().userid);

        // 添加实体id列表
        let entityList = this.state.entityList;
        let empty = true;
        for(i = 0; i <entityList.length; i++){
            if(entityList[i].checked) {
                fd.append("beanId", entityList[i].id);
                empty = false;
            }
        }

        if(empty)
            fd.append("beanId", "");

        let that = this;
        // 上传文件和检测信息并显示进度
        axios({
            method: 'post',
            url: 'http://10.141.222.205:23333/files/upload',
            data: fd,
            headers: {'Content-Type':undefined}
        })
            .then(function (data) {
                if(data.data.code === 200 && data.data.message === "请求成功"){
                    // 修改状态为检测中
                    that.changeState(2);
                    // 更新检测文件的后台id
                    that.updateDetectionID(data.data.data);

                    // 调用请求异步获取检测状态
                    that.asynctask();

                }else{
                    alert(data.data.message);
                    that.setState({disableButton: false});
                }
            })
            .catch(function (error) {
                alert(error);
                that.setState({disableButton: false});
            });
    }

    asynctask(){
        let fileIds = [];
        let detectionState = this.state.detectionState;
        for(let i = 0; i < detectionState.length; i++){
            if(detectionState[i].state === 2)
                fileIds.push(detectionState[i].id);
        }
        let that = this;

        let intervalId = setInterval(checkAsyncTaskCompleted, 1000);
        function checkAsyncTaskCompleted() {
            axios({
                method: 'get',
                url: 'http://10.141.222.205:23333/files/status',
                params: {
                    reportIdList: fileIds
                },
                paramsSerializer: function(params) {
                    return qs.stringify(params, {arrayFormat: 'repeat'});
                }
            })
                .then(function (data) {
                    let all = that.updateDetectionState(data.data.data);
                    if(all){
                        // 当所有的detection state都为3时，检测完成，clearInterval
                        clearInterval(intervalId);

                        // 更新detection result，便于下个页面访问
                        that.props.updateResult({
                            result: that.state.detectionState,
                        });

                        //当所有文件检测完毕时，可以点击下一步
                        that.setState({finished: true});
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }


    }

    render() {
        const fileItems=this.state.detectionState.map((state, index)=><tr key={state.id}>
            <td>{index+1}</td>
            <td>{state.name}</td>
            <td>{this.stateMapping(state.state)}</td>
        </tr>);

        return (
            <Container style={{minHeight: '15rem'}}>
                <h4 className="text-center">检测信息</h4>
                <Row className="justify-content-md-center mb-3">
                    <Col className="justify-content-md-center" md={{ span: 6}}>
                        文件数量：{this.state.files.length}，  文件总大小：{this.changeUnit(this.getFileSize())}
                    </Col>
                </Row>
                <Row className="justify-content-md-center mb-3">
                    <Col className="justify-content-md-center" md={{ span: 6}}>
                    检测目标：个人基本信息{this.getEntities()}
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Table style={{width: '70%'}}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>文件名</th>
                            <th>状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileItems}
                        </tbody>
                    </Table>
                </Row>
                <Row className="justify-content-md-center">
                    <Button onClick={e=>this.detection(e)} disabled={this.state.disableButton}> 开始检测 </Button>
                </Row>
            </Container>
        );
    }
}

export default Detection;