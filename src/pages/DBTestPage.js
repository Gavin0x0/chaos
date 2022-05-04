//从 OpenSea API 获取 nfts 并缓存
//缓存可采用本地缓存，也可采用网络缓存
import React from "react";
import "../styles/NFTsDemo.css";
import { getTest, addTest, delTest, updateTest } from "../apis/BackEnd-API";

class DBTestDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            input: 'test001',
            del_ids: '',
            update_id: '',
            update_value: ''
        };
    }

    //写入测试数据
    handleAddTest = (text) => {
        addTest(text).then(res => {
            this.setState({ result: JSON.stringify(res) })
        })
    }
    //获取测试数据
    handleGetTest = () => {
        getTest().then(res => {
            this.setState({
                result: JSON.stringify(res)
            })
        }).catch(err => {
            console.warn('获取失败', err)
        })
    }
    //删除测试数据
    handleDelTest = (ids) => {
        this.setState({ result: '' })
        ids.split(',').forEach(id => {
            console.log('del id:', id)
            delTest(id).then(res => {
                this.setState({ result: id + JSON.stringify(res) + '\n' + this.state.result })
            }).catch(err => {
                console.warn('删除失败', err)
            })
        })
    }

    //更新测试数据
    handleUpdateTest = (id, text) => {
        this.setState({ result: '' })
        updateTest(id, text).then(res => {
            this.setState({ result: id + JSON.stringify(res) + '\n' })
        }).catch(err => {
            console.warn('更新失败', err)
        })
    }



    render() {
        return (
            <div className='pageContainer' >
                <h1>后端连通性测试 CRUD</h1>
                <button className='nice-button' onClick={this.handleGetTest}>从Test集合读取</button>
                <div></div>
                <button className='nice-button' onClick={() => this.handleAddTest(this.state.input)}>向后端写入</button>
                <input type='text' value={this.state.input} onChange={(e) => { this.setState({ input: e.target.value }) }} />
                <div></div>
                <button className="nice-button" onClick={() => this.handleDelTest(this.state.del_ids)}>删除数据</button>
                <input type='text' placeholder="eg. 1,2,3,4" value={this.state.del_ids} onChange={(e) => { this.setState({ del_ids: e.target.value }) }} />
                <div></div>
                <button className="nice-button" onClick={() => this.handleUpdateTest(this.state.update_id, this.state.update_value)}>更新数据</button>
                <input type='text' placeholder="id" value={this.state.update_id} onChange={(e) => { this.setState({ update_id: e.target.value }) }} />
                <input type='text' placeholder="new_content" value={this.state.update_value} onChange={(e) => { this.setState({ update_value: e.target.value }) }} />
                <h4>{this.state.result}</h4>
            </div>
        );
    }
}

export default DBTestDemo;

