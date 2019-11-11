import React from 'react';
import Container from 'react-bootstrap/Container';
import {Row} from 'react-bootstrap';
import '../../css/main.css';
import Dropzone from './dropzone';
import Configure from './configure';
import StepZilla from 'react-stepzilla';
import Detection from './detection';
import Download from './download';
import axios from "axios";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.sampleStore = {
            files: [],
            entityList:  [],
            userid: props.getUser().userid,
        };

        this.detectionResult = {
            result:[],
        }
    }

    componentDidMount(){
        if(this.props.getUser().userid !== ''){
            let that = this;
            axios({
                method: 'get',
                url: 'http://localhost:23333/beans/list',
                params: {
                    uuid: this.props.getUser().userid,
                },
            })
                .then(function (data) {
                    let array = data.data.data;
                    if(array.length !== 0){
                        let tmp = [];
                        for(var i = 0; i < array.length; i++){
                            tmp.push({
                                id: array[i].id,
                                name: array[i].name,
                                type: array[i].type,
                                checked: false,
                            });
                        }
                        that.sampleStore = {
                            ...that.sampleStore,
                            entityList: tmp,
                        }
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    getStore() {
        return this.sampleStore;
    }

    updateStore(update) {
        this.sampleStore = {
            ...this.sampleStore,
            ...update,
        }
    }

    getResult(){
        return this.detectionResult;
    }

    updateResult(update){
        this.detectionResult = {
            ...this.detectionResult,
            ...update,
        }
    }

    render() {

        const steps = [
            {
                name: "文件选择",
                component: <Dropzone getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>
            },
            {
                name: "配置选择",
                component: <Configure getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>
            },
            {
                name: "文件检测",
                component: <Detection getStore={() => (this.getStore())} updateResult={(u) => {this.updateResult(u)}}/>
            },
            {
                name: "报告下载",
                component: <Download getResult={() => (this.getResult())}
                                     updateStore={(u) => {this.updateStore(u)}}
                                     updateResult={(u) => {this.updateResult(u)}}
                                     getStore={() => (this.getStore())}/>
            }

        ];
        return (
            <Container>
                <Row className="justify-content-md-center mt-lg-3">
                    <div className="main-title">隐私信息检测工具</div>
                </Row>
                <Row className="justify-content-md-center">
                    <div className="main-description">
                        <div>检测内容：个人隐私信息、自定义匹配项</div>
                    </div>
                </Row>
                <div className='step-progress'>
                    <StepZilla steps={steps}
                               hocValidationAppliedTo={[3]}
                               nextButtonText="下一步"
                               backButtonText="上一步"
                               nextButtonCls="btn btn-prev btn-primary float-right mt-3 mr-3"
                               backButtonCls="btn btn-next btn-primary float-left mt-3 ml-3"
                    />
                </div>
            </Container>
        );
    }
}

export default Main;