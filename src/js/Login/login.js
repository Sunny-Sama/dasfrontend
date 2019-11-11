import React from 'react';
import Container from "react-bootstrap/Container";
import {Row, Form, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Col from "react-bootstrap/Col";
import axios from "axios";

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            uservalid: 0,
            passvalid: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        const {username, password} = this.state;

        event.preventDefault();

        const reg0 = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/;
        const reg1=/^\w{8,32}$/;

        var testname = reg0.test(username);
        var testpass = reg1.test(password);


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

        if(testname && testpass){
            let that = this;
            axios({
                method: 'post',
                url: 'http://10.141.222.205:23333/users/login',
                params: {
                    identifier: this.state.username,
                    credential: this.state.password
                },
            })
                .then(function (data) {
                    if(data.data.code === 4102)
                        alert('用户名或密码错误');
                    else{
                        that.props.updateUser({
                            username: data.data.data.name,
                            userid: data.data.data.uuid,
                        });
                        that.props.history.push('/');
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render() {
        const { username, password } = this.state;
        return (
            <Container>
                <Row className="justify-content-md-center mt-lg-5">
                    <h3>登录</h3>
                </Row>
                <Row className="justify-content-md-center mt-lg-1">
                    <Col className="align-self-center col-lg-4">
                    <Form
                        onSubmit={e => this.handleSubmit(e)}
                    >
                        <Form.Group controlId="formUsername">
                            <Form.Label >请输入用户名：</Form.Label>
                            <Form.Control required type="text" name="username" value={username} onChange={this.handleChange} placeholder="用户名" />
                            <Form.Control.Feedback type="invalid">
                                用户名不能为空
                            </Form.Control.Feedback>
                            {this.state.uservalid===-1?(<p style={errorStyle}>用户名不合法，请重新填写</p>):null}
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>请输入密码：</Form.Label>
                            <Form.Control required type="password" name="password" value={password} onChange={this.handleChange} placeholder="密码" />
                            <Form.Control.Feedback type="invalid">
                                密码不能为空
                            </Form.Control.Feedback>
                            {this.state.passvalid===-1?(<p style={errorStyle}>密码不合法， 请重新填写</p>):null}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="float-right">
                            登录
                        </Button>
                        <Link to="/register" className="btn btn-light float-right mr-3">注册</Link>
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

export default Login;