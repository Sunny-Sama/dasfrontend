import React from 'react';
import Container from "react-bootstrap/Container";
import {Button, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Col from "react-bootstrap/Col";
import axios from 'axios';


class Register extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                password: ''
            },
            uservalid: 0,
            passvalid: 0,
            passequal: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const { user } = this.state;
        const passequal = this.state.passequal;

        const reg0 = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/;
        const reg1=/^\w{8,32}$/;

        var testname = reg0.test(user.username);
        var testpass = reg1.test(user.password);


        if (!testname) {
            this.setState({uservalid: -1});
        }else{
            this.setState({uservalid: 1});
        }
        if(!testpass){
            this.setState({passvalid: -1});
        }else{
            this.setState({passvalid: 1});
        }

        // 合法情况下提交表单
        if(testname && testpass && passequal === user.password){
            var that = this;
            axios({
                method: 'post',
                url: 'http://10.141.222.205:23333/users/signup',
                params: {
                    name: user.username,
                    password: user.password
                },
            })
                .then(function (data) {
                    if(data.data.code === 4101)
                        alert('用户名已存在，请重新填写');
                    else{
                        that.props.updateUser({
                            username: data.data.data.name,
                            userid: data.data.data.uuid,
                        });
                        that.props.history.push('/');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handlePass(event){
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        })
    }

    render(){
        const { user, passequal } = this.state;
        return (
            <Container>
                <Row className="justify-content-md-center mt-lg-5">
                    <h3>注册</h3>
                </Row>
                <Row className="justify-content-md-center mt-lg-1">
                    <Col className="align-self-center col-lg-4">
                    <Form
                        onSubmit={e => this.handleSubmit(e)}
                    >
                        <Form.Group controlId="formRUsername">
                            <Form.Label >用户名：</Form.Label>
                            <Form.Control required type="text" name="username" value={user.username} onChange={this.handleChange} placeholder="用户名" />
                            <Form.Text className="text-muted">
                                用户名支持中英文、数字及下划线，长度小于20位
                            </Form.Text>
                            {this.state.uservalid===-1?(<p style={errorStyle}>用户名不合法，请重新填写</p>):null}
                        </Form.Group>

                        <Form.Group controlId="formRPassword0">
                            <Form.Label>密码：</Form.Label>
                            <Form.Control required type="password" name="password" value={user.password} onChange={this.handleChange} placeholder="密码" />
                            <Form.Text className="text-muted">
                                密码支持英文、数字以及下划线，长度为8-32位
                            </Form.Text>
                            {this.state.passvalid===-1?(<p style={errorStyle}>密码不合法， 请重新填写</p>):null}
                        </Form.Group>

                        <Form.Group controlId="formRPassword1">
                            <Form.Label>确认密码：</Form.Label>
                            <Form.Control required type="password" name="passequal" value={passequal} onChange={e=>this.handlePass(e)} placeholder="确认密码" />
                            {(passequal!==""&&passequal!==user.password)?(<p style={errorStyle}>重复密码不一致，请修改</p>):null}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="float-right">
                            注册
                        </Button>
                        <Link to="/login" className="btn btn-light float-right mr-3">登录</Link>
                    </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const errorStyle = {
    color: 'red'
};

export default Register;

