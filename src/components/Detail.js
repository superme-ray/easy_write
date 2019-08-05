import React, {Component} from 'react'
import '../styles/detail.css';
import axios from 'axios';
import config from '../config';
import {Layout, Breadcrumb, Icon, Spin} from "antd";
import 'antd/dist/antd.css';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {formatDate} from './common';
import {Link} from "react-router-dom"
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();


const {Header, Content, Footer} = Layout;

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLoading:true
        };
        this.goBack = this.goBack.bind(this);
    }

    async componentDidMount() {
        let id = this.props.match.params.id;
        let url = config.hostname + `/detail/${id}`;
        let res = await this.fetchData(url);
        let data = res.data;
        data.create_time = formatDate(data.create_time);
        this.setState({data, showLoading:false})
    }

    async goBack(){
        await history.goBack();
    }

    async fetchData(url) {
        let res = await axios.get(url)
        return res;
    }

    render() {
        const {data, showLoading} = this.state;
        if(showLoading){
            return  <div className="loading-box"><Spin delay={100} tip='网速慢,别慌...' size="large"/></div>
        }

        return (
            <div className='detail-container'>
                <Layout>
                    <Header className='detail-header'>
                        <div className="back" onClick={this.goBack}>
                                <Breadcrumb className='breadcrumb'>
                                    <Breadcrumb.Item>
                                        <Icon type="left"/>&nbsp;返回
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                        </div>
                    </Header>
                    <Content className='detail-content'>
                        {data ?
                            <div>
                                <div className="title-box">
                                    <div className="title">{data.title}</div>
                                    <div className="desc">
                                        <div className="create-tiem">{data.create_time}</div>
                                        <div className="tag">{data.tag}</div>
                                    </div>
                                </div>
                                <div className="content">
                                    <div dangerouslySetInnerHTML = {{__html:data.content}} ></div>
                                </div>
                            </div>
                            :
                                null
                        }

                    </Content>
                    <Footer className='footer-detail'>
                        Copyright@<span>superme-ray.github.com</span>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default Detail;
