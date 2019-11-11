import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import axios from "axios";
import InputGroup from "react-bootstrap/InputGroup";
import {FormControl} from "react-bootstrap";

class ConfigDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.location.state.id,
            regexList: [],
            name: '',
            abbrev: '',
            abb_validate: 0,
            reg_validate: 0
        }

        this.record = {
            addList: [],
            deleteList: [],
            updateList: [],
            bean: null,
        };
    }

    componentDidMount() {
        let that = this;
        axios({
            method: 'get',
            url: 'http://localhost:23333/beans/get',
            params: {
                beanId: this.state.id,
            },
        })
            .then(function (data) {
                if (data.data.code === 200) {
                    that.setState({
                        regexList: data.data.data.regexList,
                        name: data.data.data.name,
                        abbrev: data.data.data.type,
                        abb_validate: 0,
                        reg_validate: 0
                    });

                } else {
                    alert(data.data.message)
                }
            })
            .catch(function (error) {
                alert(error);
            });
    }

    handleInput(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    testRegex(regex) {
        try {
            new RegExp(regex);
        } catch (e) {
            return false;
        }
        return true;
    }

    inputValid() {
        const {regexList, name, abbrev} = this.state;
        if (name.trim().length > 0 && abbrev.trim().length > 0 && regexList.length > 0) {
            let abbv = false;

            var reg = /^[A-Za-z]+$/;
            var test = reg.test(abbrev);

            if (!test)
                this.setState({abb_validate: -1});
            else {
                this.setState({abb_validate: 1});
                abbv = true;
            }

            let all = true;
            for (let i = 0; i < regexList.length; i++) {
                if (!this.testRegex(regexList[i].expression))
                    all = false;
            }

            if (all)
                this.setState({reg_validate: 1});
            else
                this.setState({reg_validate: -1});

            if (abbv && all)
                return true;
            else
                return false;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.inputValid()) {
            const {regexList, name, abbrev} = this.state;
            for (let i = 0; i < regexList.length; i++) {
                if (regexList[i].id === -1) {
                    this.record.addList.push(regexList[i].expression);
                } else {
                    this.record.updateList.push({
                        beanId: this.state.id,
                        id: regexList[i].id,
                        expression: regexList[i].expression
                    });
                }
            }
            const postContent = this.record;
            postContent.bean = {
                id: this.state.id,
                name: name,
                type: abbrev,
                regexList: [],
                uuid: this.props.getUser().userid,
            }


            let that = this;

            axios({
                method: 'post',
                url: 'http://localhost:23333/beans/update',
                params: {
                   data: JSON.stringify(postContent)
                },
            })
                .then(function (data) {
                    if(data.data.code === 200){
                        alert("修改成功！");

                        axios({
                            method: 'get',
                            url: 'http://localhost:23333/beans/get',
                            params: {
                                beanId: that.state.id,
                            },
                        })
                            .then(function (data) {
                                if (data.data.code === 200) {
                                    that.setState({
                                        regexList: data.data.data.regexList,
                                        name: data.data.data.name,
                                        abbrev: data.data.data.type,
                                        abb_validate: 0,
                                        reg_validate: 0
                                    });
                                } else {
                                    alert(data.data.message)
                                }
                            })
                            .catch(function (error) {
                                alert(error);
                            });
                    }
                })
                .catch(function (error) {
                    alert(error);
                });

        }
    }

    deleteRegex(event, index) {
        event.preventDefault();
        event.stopPropagation();

        let regexList = this.state.regexList;

        let r = window.confirm("确认删除？");
        if (r) {
            if (regexList[index].id !== -1)
                this.record.deleteList.push(regexList[index].id);
            regexList.splice(index, 1);
        }

        this.setState({
            regexList: regexList
        })

    }

    handleRegexChange(event, index) {
        event.preventDefault();
        event.stopPropagation();
        let regexList = this.state.regexList;

        regexList[index].expression = event.target.value;
        this.setState({
            regexList: regexList,
        });

    }

    handleAdd(event) {
        event.preventDefault();
        event.stopPropagation();

        let regexList = this.state.regexList;
        regexList.push({
            id: -1,
            expression: '',
        })
        this.setState({regexList: regexList});
    }

    render() {
        const {name, abbrev} = this.state;
        const regexList = this.state.regexList.map((regex, index) =>
            <InputGroup className="mb-3 mr-4"
                        key={index}
                        style={{width: '40%', float: 'left'}}
            >
                <FormControl onChange={e => this.handleRegexChange(e, index)}
                             value={regex.expression}
                />
                <InputGroup.Append>
                    <Button variant="outline-danger" onClick={e => this.deleteRegex(e, index)}>删除</Button>
                </InputGroup.Append>
            </InputGroup>);

        let that = this;
        return (
            <Container className="mt-3" style={{width: '60%'}}>
                <Row className="justify-content-md-center">
                    <Form id="modal-form" style={{width: '100%'}}>
                        <Form.Group style={{width: '45%'}} className="float-left">
                            <Form.Label>实体名称</Form.Label>
                            <Form.Control required type="text" placeholder="请输入实体名称" value={name} name="name"
                                          onChange={e => this.handleInput(e)}/>
                            <Form.Text className="text-muted">
                                例如：“MAC地址”或“银行卡号”
                            </Form.Text>
                        </Form.Group>

                        <Form.Group style={{width: '45%'}} className="float-right">
                            <Form.Label>实体缩写</Form.Label>
                            <Form.Control required type="text" placeholder="请输入实体英文缩写" value={abbrev} name="abbrev"
                                          onChange={e => this.handleInput(e)}/>
                            <Form.Text className="text-muted">
                                仅包含英文大小写，例如：“MAC”或“BANK”
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    {this.state.abb_validate === -1 ? (
                        <p className="float-left" style={{color: 'red'}}>实体缩写不合法，请按要求进行修改</p>) : null}
                </Row>

                <Row>
                    <Form.Group className="float-left" style={{width: '100%'}}>
                        <Form.Label>正则表达式&nbsp;&nbsp;&nbsp;<Button size="sm" variant="outline-danger"
                                                                   onClick={e => this.handleAdd(e)}>添加</Button></Form.Label>
                        <Form.Text className="text-muted">
                            符合Java正则表达式要求，例如：“[A-Za-z]+”,表达式两侧无需添加引号。详情请<Link
                            to="https://www.runoob.com/java/java-regular-expressions.html"
                            target="_blank">参考网站</Link>。
                            若存在多个正则表达式，请在每两个表达式间添加换行符。
                        </Form.Text>
                    </Form.Group>
                    {regexList}
                </Row>
                {this.state.reg_validate === -1 ? (
                    <p className="float-left" style={{color: 'red'}}>正则表达式不合法，请按要求进行修改</p>) : null}
                <Row className="justify-content-md-end">
                    <Button onClick={e => this.handleSubmit(e)} className="mr-3">提交</Button>
                    <Button variant="outline-primary" onClick={function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.props.history.push('/config');
                    }}>返回</Button>
                </Row>
            </Container>);
    }
}

export default ConfigDetail;