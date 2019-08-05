import React, {Component} from 'react'
import '../styles/post.css';
import {Button, Input, Alert, Radio, Spin} from "antd";
import 'antd/dist/antd.css';
import axios from 'axios'
import config from '../config'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'

const {TextArea} = Input;


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            type: 'error',
            editorState: BraftEditor.createEditorState(null),
            value: 'javascript',
        };
        this.getInputValue = this.getInputValue.bind(this);
        this.postContent = this.postContent.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    getInputValue(e) {
        this.setState({title: e.target.value})
    }

    postContent() {
        let message = '';
        let title = this.state.title;
        let content = this.state.content;
        if (!title || content=='<p></p>' || !content) {
            if (!title) {
                message = '标题不能为空';
            } else {
                message = '内容不能为空';
            }
            this.setState({message, showMessage: true});
            return;
        }
        new Promise(resolve => {
            resolve(this.setState({disable: true ,showLoading: true}))
        }).then(() => {
            let postObj = {
                title: title,
                content: content,
                tag:this.state.value
            };
            let url = config.hostname + '/save'
            axios.post(url, postObj)
                .then(res => {
                    message = '发表成功'
                    this.setState({showLoading:false, title: '', editorState: BraftEditor.createEditorState(null), content:'',message, showMessage: true, type: 'success'});
                    return;
                })
                .then(() => {
                    setTimeout(() => {
                        this.setState({showMessage: false, disable: false, type:'error'})
                    }, 2000)
                })
        }).catch(err => {
            console.log(err)
            message = err;
            this.setState({disable: true, type:'error'})
            throw new Error(err)
        })
    }

    onChange (e) {
        this.setState({
            value: e.target.value,
        });
    };

    handleEditorChange = (editorState) => {
        let content = editorState.toHTML();
        this.setState({content, editorState})
    }

    render() {
        return (
            <div className="blogmanager">
                <div className="jumbotron">
                    <h3>个人博客管理后台</h3>
                </div>
                <div className="input-group">
                    <Input placeholder="输入标题"
                           onChange={this.getInputValue}
                           value={this.state.title}
                    />
                </div>
                <div className="check-box">
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value='java'>java</Radio>
                        <Radio value='mongodb'>mongodb</Radio>
                        <Radio value='javascript'>javascript</Radio>
                        <Radio value='nodejs'>nodejs</Radio>
                    </Radio.Group>
                </div>

                {this.state.showMessage ?
                    <div className='showMessage-box'>
                            <Alert message={this.state.message} type={this.state.type} showIcon/>
                    </div>
                    :
                    null
                }

                {
                    this.state.showLoading ?
                        <div className='hidebox'>
                            <div className="loading-box"><Spin delay={100} tip='网速慢,别慌...' size="large"/></div>
                        </div>
                        :
                        null
                }

                <div className="rich-text">
                    <BraftEditor
                            value={this.state.editorState}
                        onChange={this.handleEditorChange}
                        onSave={this.submitContent}
                        className='editor'
                    />
                </div>
                <div className='btn'>
                    <Button type='primary'
                            onClick={this.postContent}
                            disabled={this.state.disable}
                    >提交</Button>
                </div>
            </div>
        )
    }
}

export default Post;
