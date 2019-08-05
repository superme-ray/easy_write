import React from 'react';
import '../styles/home.css';
import List from './List'
import axios from 'axios'
import config from '../config'
import Post from './Post'
import {Pagination, Spin, Layout, Menu, Icon, Button} from 'antd';
import 'antd/dist/antd.css';
import {formatDate} from './common';

const {Header, Footer, Sider, Content} = Layout;
const {SubMenu} = Menu;


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            defaultCurrent: 1,
            total: 0,
            pageSize: 6,
            pageCount: 1,
            showLoading: true,
            showBox: false,
            tag: ''
        };
        this.changePage = this.changePage.bind(this)
    }

    checkMenu(e) {
        if (this.state.lastKey === e.key) return;
        let lastKey;
        if (e.key && e.key === 'post') {
            this.setState({showBox: true, lastKey: e.key});
            return;
        }
        let setObj = {
            showBox: false,
            showLoading: true,
            pageCount: 1,
            lastKey: e.key
        };
        if (e.key && ['mongodb', 'java', 'javascript', 'nodejs'].includes(e.key)) {
            setObj.tag = e.key;
        } else if (e.key === 'index') {
            setObj.tag = ''
        }

        let pageCount = this.state.pageCount;
        new Promise(resolve => {
            resolve(this.setState(setObj))
        }).then(() => {
            return this.getData(pageCount, this.state.tag)
        })
    };

    getData(pageCount, tag) {
        let query = `?pagecount=${pageCount}&pagesize=${this.state.pageSize}&tag=${tag}`;
        let url = config.hostname + query;

        return axios.get(url)
            .then(res => {
                return this.setState({
                    list: res.data.list.map(item => {
                        item.create_time = formatDate(item.create_time)
                        return item;
                    }),
                    total: res.data.count,
                    showLoading: false
                })
            })
    }

    componentDidMount() {
        let pageCount = 1;
        let tag = '';
        this.getData(pageCount, tag)
            .catch(err => {
                console.log(err)
                throw new Error(err)
            })
    }

    changePage(num) {
        let pageCount = num;
        this.getData(pageCount, this.state.tag)
    }

    render() {
        return (
            <div className='container'>
                <Layout>
                    {/*<Header>Header</Header>*/}
                    <Layout>
                        <Sider>
                            <div style={{width: 200}}>
                                <Menu
                                    defaultSelectedKeys={['index']}
                                    // defaultOpenKeys={['sub1']}
                                    mode="inline"
                                    theme="dark"
                                >
                                    <Menu.Item key="index"
                                               onClick={this.checkMenu.bind(this)}
                                    >
                                        <Icon type="pie-chart"/>
                                        <span>首页</span>
                                    </Menu.Item>
                                    <Menu.Item key="post"
                                               onClick={this.checkMenu.bind(this)}
                                    >
                                        <Icon type="desktop"/>
                                        <span>发表</span>
                                    </Menu.Item>
                                    <SubMenu
                                        key="sub1"
                                        title={<span><Icon type="mail"/><span>文章类型</span></span>}
                                    >
                                        <Menu.Item key="mongodb" onClick={this.checkMenu.bind(this)}>mongodb</Menu.Item>
                                        <Menu.Item key="java" onClick={this.checkMenu.bind(this)}>java</Menu.Item>
                                        <Menu.Item key="javascript"
                                                   onClick={this.checkMenu.bind(this)}>javascript</Menu.Item>
                                        <Menu.Item key="nodejs" onClick={this.checkMenu.bind(this)}>nodejs</Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </div>
                        </Sider>
                        <Content>
                            {
                                !this.state.showBox ?
                                    this.state.showLoading ?
                                        <div className="loading-box"><Spin delay={100} tip='网速慢,别慌...' size="large"/>
                                        </div> :
                                        this.state.list.length > 0 ?
                                            <div className='list-container'>
                                                <List list={this.state.list}></List>
                                                <div className="footer">
                                                    <Pagination defaultCurrent={this.state.defaultCurrent}
                                                                total={this.state.total}
                                                                onChange={this.changePage}
                                                                defaultPageSize={6}
                                                    />
                                                </div>
                                            </div>
                                            :
                                            <div className='noconten'>
                                                <span>暂无内容</span>
                                            </div>
                                    :
                                    <Post></Post>
                            }
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Home;
