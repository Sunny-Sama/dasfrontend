import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import qs from 'qs';
import {Link} from "react-router-dom";

class NewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regexList: '',
            name: '',
            abbrev: '',
            abb_validate: 0,
            reg_validate: 0
        }
    }

    inputValid() {
        const {regexList, name, abbrev} = this.state;
        if (regexList.trim().length > 0 && abbrev.trim().length > 0 && name.trim().length > 0) {
            let abbv = false;

            var reg = /^[A-Za-z]+$/;
            var test = reg.test(abbrev);

            if (!test)
                this.setState({abb_validate: -1});
            else{
                this.setState({abb_validate: 1});
                abbv = true;
            }


            let temp = regexList.split(/[\n]/);
            let all = true;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] === "") {
                    temp.splice(i, 1);
                    i--;
                } else {
                    try {
                        new RegExp(temp[i]);
                    } catch (e) {
                        all = false;
                    }
                }
            }

            if (temp.length !== 0 && all) {
                this.setState({
                    reg_validate: 1
                })
            } else {
                this.setState({
                    reg_validate: -1
                })
            }

            if (abbv && temp.length !== 0 && all) {
                return true;
            }
        }
        return false;
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const {regexList, name, abbrev} = this.state;

        if (this.inputValid()) {
            let temp = regexList.split(/[\n]/);
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] === "") {
                    temp.splice(i, 1);
                    i--;
                }
            }

            let that = this;

            axios({
                method: 'post',
                url: 'http://10.141.222.205:23333/beans/create',
                params: {
                    name: name,
                    type: abbrev,
                    regexList: temp,
                    uuid: this.props.uuid,
                },
                paramsSerializer: function (params) {
                    return qs.stringify(params, {arrayFormat: 'repeat'});
                }
            })
                .then(function (data) {
                    let cardList = that.props.getConfig();
                    cardList.push(data.data.data);
                    that.props.updateConfig(cardList);
                    that.clearState();
                    that.props.closeModel();
                })
                .catch(function (error) {
                    alert(error);
                });

        }
    }

    clearState() {
        this.setState({
            regexList: '',
            name: '',
            abbrev: '',
            abb_validate: 0,
            reg_validate: 0
        })
    }

    handleInput(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    render() {

        const {regexList, name, abbrev} = this.state;
        const {getConfig, updateConfig, closeModel, uuid, ...rest} = this.props;
        return (
            <Modal
                {...rest}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        添加自定义实体
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="modal-form">
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

                        <Form.Group className="float-left" style={{width: '100%'}}>
                            <Form.Label>正则表达式</Form.Label>
                            <Form.Control required as="textarea" rows="4" type="text" value={regexList} name="regexList"
                                          onChange={e => this.handleInput(e)}/>
                            <Form.Text className="text-muted">
                                符合Java正则表达式要求，例如：“[A-Za-z]+”,表达式两侧无需添加引号。详情请<Link
                                to="https://www.runoob.com/java/java-regular-expressions.html"
                                target="_blank">参考网站</Link>。
                                若存在多个正则表达式，请在每两个表达式间添加换行符。
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    {this.state.abb_validate === -1 ? (
                        <p className="float-left" style={{color: 'red'}}>实体缩写不合法，请按要求进行修改</p>) : null}
                    {this.state.reg_validate === -1 ? (
                        <p className="float-left" style={{color: 'red'}}>正则表达式不合法，请按要求进行修改</p>) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={e => this.handleSubmit(e)}>提交</Button>
                    <Button onClick={this.props.onHide} variant="light">关闭</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewModal;