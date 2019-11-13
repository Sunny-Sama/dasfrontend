import React from 'react';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {FaSearch} from 'react-icons/fa';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Main from '../Main/main';
import Showpage from '../Show/show';
import History from '../History/history';
import Login from '../Login/login';
import Register from '../Login/register';
import Config from '../Config/config';
import About from '../About/about';
import ConfigDetail from '../Config/configdetail';
import HistoryDetail from '../History/historydetail';
import '../../css/nav.css';
import { NavLink } from 'reactstrap';

class Navg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false
        }
        this.user = {
            username: '',
            userid: '',
        }
    }

    getUser() {
        return this.user;
    }

    updateUser(update) {
        this.user = {
            ...this.user,
            ...update,
        }
        this.setState({logged: true});
    }

    logout(event){
        event.preventDefault();
        event.stopPropagation();

        this.user = {
            username: '',
            userid: '',
        }

        this.setState({logged: false});
        window.location.href='/login';
    }

    render() {
        return (
            <Router>
                <Navbar className="my-nav-bar" variant="dark">
                    <Navbar.Brand href="/">
                        <h2><FaSearch/> Privacy Detector</h2>
                    </Navbar.Brand>
                    <Navbar.Collapse>
                        <div>隐私信息检测平台<br></br>复旦大学数据分析与安全实验室</div>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavLink tag={Link} to="/" className="my-nav-title">首页</NavLink>
                            <NavLink tag={Link} to="/show" className="my-nav-title">演示</NavLink>
                            <NavLink tag={Link} to="/about" className="my-nav-title">关于</NavLink>
                            {this.state.logged ? (
                                <NavDropdown title="个人中心" className="my-nav-title" id="nav-dropdown">
                                    <Link to="/history" className="my-nav-link">历史报告</Link><p/>
                                    <Link to="/config" className="my-nav-link">检测配置</Link><p/>
                                    <Link to="/config" className="my-nav-link">账号信息</Link>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item onClick={e=>this.logout(e)}>退出登录</NavDropdown.Item>
                                </NavDropdown>
                                ) : (
                                <NavLink tag={Link} to="/login" className="my-nav-title">登录</NavLink>)}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Route
                    path="/"
                    render={(props) => <Main {...props}
                                              getUser={() => (this.getUser())}/>}
                    exact
                />
                <Route
                    path="/show"
                    component={Showpage}
                />
                <Route
                    path="/about"
                    component={About}
                    exact
                />
                <Route
                    path="/login"
                    render={(props) => <Login {...props}
                                              getUser={() => (this.getUser())}
                                              updateUser={(u) => {this.updateUser(u)}}/>}
                />
                <Route
                    path="/register"
                    render={(props) => <Register {...props}
                                                 getUser={() => (this.getUser())}
                                                 updateUser={(u) => {this.updateUser(u)}}/>}
                />
                <Route
                    path="/history"
                    render={(props) => <History {...props}
                                                getUser={() => (this.getUser())}/>}
                />
                <Route
                    path="/config"
                    render={(props) => <Config {...props}
                                                 getUser={() => (this.getUser())}/>}
                />
                <Route
                    path="/configdetail"
                    render={(props) => <ConfigDetail {...props}
                                                     getUser={() => (this.getUser())}/>}
                />
                <Route
                    path="/historydetail"
                    component={HistoryDetail}
                />
            </Router>
        );
    }
}


export default Navg;