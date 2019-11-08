import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import '../../css/main.css';
import Form from 'react-bootstrap/Form';
import NewModal from './newmodal';

class Configure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: props.getStore().entityList,
            modalShow: false
        }

    }

    handleCheck(event){
        event.stopPropagation();
        let entityList = this.state.entityList;
        entityList.forEach(entity => {
            if (entity.name === event.target.value)
                entity.checked = !entity.checked;
        });
        this.setState({entityList: entityList});
        this.props.updateStore({
            entityList: entityList,
        });
    }

    handleCheckAll(event){
        event.stopPropagation();
        let entityList = this.state.entityList;
        entityList.forEach(entity => {
            entity.checked = true;
        });
        this.setState({entityList: entityList});
        this.props.updateStore({
            entityList: entityList,
        });
    }

    render() {
        const Items = this.state.entityList.map(entity =>
            <Form.Check inline
                        key={entity.id}
                        type="checkbox"
                        checked={entity.checked}
                        value={entity.name}
                        label={entity.name}
                        onChange={e=>this.handleCheck(e)}
            />);

        let modalClose = () => this.setState({ modalShow: false });

        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col className="justify-content-md-center configure-window" md={{ span: 8}}>
                        <h5 className="text-center mt-2">匹配自定义实体（可跳过）</h5>
                        {this.state.entityList.length === 0? (<p>您还未添加自定义实体</p>):(
                            <Form style={{fontSize: '1.1em'}}>
                                {Items}
                            </Form>
                        )}
                        <div style={{position: 'absolute', right: '30px', bottom: '10px'}}>
                            <Button variant="outline-primary"
                                    className="float-right"
                                    onClick={e=>this.handleCheckAll(e)}
                                    disabled={this.state.entityList.length === 0}
                                    >全选</Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => this.setState({ modalShow: true })}
                                className="float-right mr-3"
                            >
                                添加
                            </Button>
                            <NewModal
                                show={this.state.modalShow}
                                onHide={modalClose}
                                getStore={() => (this.props.getStore())}
                                updateStore={(u) => {this.props.updateStore(u)}}
                                closeModel={()=>this.setState({ modalShow: false })}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>);
    }
}

export default Configure;

