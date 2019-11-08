import React from 'react';
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/es/FormControl";
import {Link} from "react-router-dom";
import NewModal from "./newmodal";
import axios from "axios";

class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            searchContent: '',
            cardList: []
        }
    }

    componentDidMount() {
        let that = this;
        if (this.props.getUser().userid !== '') {
            axios({
                method: 'get',
                url: 'http://10.132.140.56:23333/beans/list',
                params: {
                    uuid: this.props.getUser().userid,
                },
            })
                .then(function (data) {
                    let array = data.data.data;
                    if (array.length !== 0) {
                        that.setState({
                            cardList: array,
                        })
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    getConfig() {
        return this.state.cardList;
    }

    updateConfig(update) {
        this.setState({
            cardList: update
        });
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        // TODO: 搜索card
    }

    deleteCard(event, id) {
        event.preventDefault();
        event.stopPropagation();

        let r = window.confirm("确认删除?");
        let that = this;

        if(r){
            axios({
                method: 'post',
                url: 'http://10.132.140.56:23333/beans/delete',
                params: {
                    beanId: id,
                },
            })
                .then(function (data) {
                    if (data.data.code !== 200)
                        alert(data.data.message);
                    else{
                        that.removeCard(id);
                    }
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    removeCard(id) {
        let cardList = this.state.cardList;

        for (var i = 0; i < cardList.length; i++) {
            if (cardList[i].id === id) {
                cardList.splice(i, 1);
                break;
            }
        }

        this.setState({
            cardList: cardList,
        })
    }

    render() {

        let modalClose = () => this.setState({modalShow: false});
        const cardList = this.state.cardList.map(card => <Card style={{width: '23%', height: '20rem'}}
                                                               className="m-2 float-left" key={card.id}>
            <Card.Body>
                <Card.Title>名称：{card.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">标签：{card.type}</Card.Subtitle>
                <p>正则表达式：</p>
                <div className="overflow-auto" style={{height: '8rem'}}>
                    {card.regexList.map(regex => <Regex key={regex.id} content={regex.expression}/>)}
                </div>
                <Link className="btn btn-primary"
                      to={{pathname: '/configdetail', state: {id: card.id}}}
                      style={{position: 'absolute', bottom: '20px', right: '20px'}}>编辑</Link>
                <Button variant="danger" style={{position: 'absolute', bottom: '20px', right: '90px'}}
                        onClick={e => this.deleteCard(e, card.id)}>删除</Button>
            </Card.Body>
        </Card>);

        return (
            <Container className="mt-3">
                <Row className="mb-3">
                    <Form inline className="ml-4">
                        <FormControl type="text"
                                     className="mr-sm-2"
                                     name="search"
                                     value={this.state.searchContent}
                                     onChange={e => this.handleChange(e)}/>
                        <Button variant="outline-primary" className="mr-2"
                                onClick={e => this.handleSearch(e)}>查找</Button>
                        <Button variant="primary" onClick={() => this.setState({modalShow: true})}>添加</Button>
                    </Form>
                    <NewModal
                        show={this.state.modalShow}
                        onHide={modalClose}
                        getConfig={() => (this.getConfig())}
                        updateConfig={(u) => {
                            this.updateConfig(u)
                        }}
                        closeModel={() => this.setState({modalShow: false})}
                        uuid={this.props.getUser().userid}
                    />
                </Row>
                {this.state.cardList.length === 0?(<p>您还没有添加自定义实体，请添加</p>):cardList}
            </Container>
        )
    }
}

function Regex(props) {
    return (<p className="m-0">
        {props.content}
    </p>)
}

export default Config;