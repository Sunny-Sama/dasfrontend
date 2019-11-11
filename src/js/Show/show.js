import React from 'react';
import {Container, Form, Button, Row, Col, Card} from 'react-bootstrap';
import {FaRedo} from 'react-icons/fa';
import Notation from './notation';
import renderHTML from 'react-render-html';
import axios from "axios";

class Showpage extends React.Component {
    constructor(props){
        super(props);

        const samples = [
            '我的名字叫张三，我住在上海市浦东新区蔡伦路100号101室，我的邮箱地址是12345678@163.com。',
            '原告：李四，男，1990年8月18日生，汉族，身份证号码：350925199008184738。家庭住址：福建省宁德市周宁县狮城镇西环路999号。',
            '这片区域的IP地址范围是138.68.11.10到138.68.11.60。',
            '大家一起来帮帮他，王明期盼着能通过治疗和自己的坚强，渡过这一难关。如果您也想助他一臂之力，可以通过下面的方式。支付宝：15524012345，中国银行：6216611234567890。'
        ];

        const sampleResult = [
            '我的名字叫<span class="nr">张三</span>，我住在<span class="ns">上海市浦东新区蔡伦路100号101室</span>，我的邮箱地址是<span class="EMAIL">12345678@163.com</span>。',
            '原告：<span class="nr">李四</span>，男，<span class="DATE">1990年8月18日</span>生，汉族，身份证号码：<span class="ID">350925199008184738</span>。家庭住址：<span class="ns">福建省宁德市周宁县狮城镇西环路999号</span>。',
            '这片区域的IP地址范围是<span class="IP">138.68.11.10</span>到<span class="IP">138.68.11.60</span>。',
            '大家一起来帮帮他，<span class="nr">王明</span>期盼着能通过治疗和自己的坚强，渡过这一难关。如果您也想助他一臂之力，可以通过下面的方式。支付宝：<span class="PHONE">13837455691</span>，中国银行：<span class="DEPOSIT">6216611234567890</span>。'
        ];

        this.state = {
            samples: samples,
            sampleResult: sampleResult,
            index: 0,
            sampleInput: "",
            showSample: true,
            detectionResult: ""
        }
    }

    handleInput(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    changeSample(){
        this.setState({
            showSample: true
        })
        const samples = this.state.samples;
        const index = (this.state.index+1)%samples.length;
        this.setState({
            index: index,
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            showSample: false
        })

        let that = this;

        let sentence = this.state.sampleInput;
        if(sentence.length === 0)
            sentence = this.state.samples[this.state.index];

        if(sentence.length > 500)
            sentence = sentence.substring(0,501);

        axios({
            method: 'get',
            url: 'http://10.141.222.205:23333/show',
            params: {
                sentence: sentence
            },
        })
            .then(function (data) {
                if(data.data.code === 200){
                    that.setState({
                        detectionResult: data.data.data,
                    })
                }else{
                    alert(data.data.message);
                }
            })
            .catch(function (error) {
                alert(error);
            });
    }

    render(){
        const samples = this.state.samples;
        const sampleResult = this.state.sampleResult;
        return(
            <Container>
                <Row className="justify-content-md-center mt-lg-5">
                    <Col md={{ span: 10}}>
                        <Form>
                            <Form.Group controlId="uploadForm">
                                <Form.Label>请输入待检测文本，字数限制在500以内：</Form.Label>
                                <Form.Control as="textarea" rows="5" placeholder={samples[this.state.index]} name = "sampleInput" value={this.state.sampleInput} onChange={e=>this.handleInput(e)}/>
                            </Form.Group>
                            <Button type="submit" className="float-right" onClick={e=>this.handleSubmit(e)}>
                                提交文本
                            </Button>
                            <Button variant="light" onClick={()=>this.changeSample()} className="float-right mr-3">
                                <FaRedo/> 换一个
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-lg-5 ">
                    <Col sm={7}>
                        <Card style={cardstyle}>
                            <Card.Header>检测结果 (若文本中仅包含人名，则不予展示)</Card.Header>
                            <Card.Body>{this.state.showSample?(renderHTML(sampleResult[this.state.index])):(
                                renderHTML(this.state.detectionResult)
                            )}</Card.Body>
                        </Card>
                    </Col>
                    <Col sm={3}>
                        <Card style={cardstyle}>
                            <Card.Header>实体类别图示</Card.Header>
                            <Card.Body><Notation/></Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const cardstyle={
    minHeight: '20em',
}

export default Showpage;