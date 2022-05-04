//从 OpenSea API 获取 nfts 并缓存
//缓存可采用本地缓存，也可采用网络缓存
import React from "react";
import { ethers } from 'ethers'
import "../styles/NFTsDemo.css";
import RetrieveAssets from '../apis/OpenSea-API'

/**
 * 异步请求发起钱包授权并获取钱包地址
 */
const connect = () => {
    return new Promise(async (resolve, reject) => {
        try {
            //通过 provider 连接到以太坊网络，window.ethereum 是 MetaMask 提供的全局变量
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            //MetaMask 需要向用户请求权限才能连接用户帐户，通过RPC调用获取用户的帐户信息
            await provider.send("eth_requestAccounts", [])
            //MetaMask 需要签署交易来发送和支付 ether 以改变区块链内的状态，所以需要获取 signer
            const signer = provider.getSigner()

            const accountAddress = await signer.getAddress()
            resolve(accountAddress)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

//通过Opensea API返回的数据渲染NFT列表
const createOpenseaTokenElement = ({ name, collection, description, permalink, image_preview_url, id }) => {
    return (
        <div key={id} className="nft-card" id={`${collection.slug}_${id}`}>
            <h5 className='nft-name'>{name}</h5>
            <a href={permalink}>
                <img className="nft-img" src={image_preview_url} alt={description} />
            </a>
        </div>
    )
}

class NFTsDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            currentAddress: '',
            nextPageCursor: '',
            previousPageCursor: '',
        };
    }

    //加载地址中的NFTs并渲染NFT列表
    renderTokensForOwner = (ownerAddress) => {
        RetrieveAssets({ owner: ownerAddress }).then(res => {
            this.setState({
                nextPageCursor: res.next,
                previousPageCursor: res.previous,
                nfts: res.assets.map(createOpenseaTokenElement)
            })
            // let nfts_list = res.assets.map(createOpenseaTokenElement)
            // this.setState({ nfts: [...this.state.nfts, nfts_list] }) //追加写入
        }).catch(err => {
            console.warn('获取失败', err)
        })
    }
    //加载上一页
    loadPreviousPage = () => {
        RetrieveAssets({ owner: this.state.currentAddress, cursor: this.state.previousPageCursor }).then(res => {
            this.setState({
                nextPageCursor: res.next,
                previousPageCursor: res.previous,
                nfts: res.assets.map(createOpenseaTokenElement)
            })
        }
        ).catch(err => {
            console.warn('获取失败', err)
        })
    }

    //加载下一页
    loadNextPage = () => {
        RetrieveAssets({ owner: this.state.currentAddress, cursor: this.state.nextPageCursor }).then(res => {
            this.setState({
                nextPageCursor: res.next,
                previousPageCursor: res.previous,
                nfts: res.assets.map(createOpenseaTokenElement)
            })
        }).catch(err => {
            console.warn('获取失败', err)
        })
    }

    //更换授权账户
    changeDemoAccount = (index) => {
        const demoAccounts = [
            '0x6F533032f9087DAc099e093200c827DE6fc6Ed8C',//我的
            '0xb65893E83bbD9FA5326446251E32Cab8eCC01544',//w
            '0x42F9Ca5c15Af094B9EEE30DcD16d14C3883Aa9f7',
            '0x2B6607bF41d2295fe51df244B42e4D8db094edF3',
            '0x9e77d5b68f0a73d7e8e7d9c8d8f7b5cbfb8a4e28',
            '0xb65893E83bbD9FA5326446251E32Cab8eCC01544',
        ]
        // console.log('changeDemoAccount:', demoAccounts[index])
        this.setState({ currentAddress: demoAccounts[index] })
        this.renderTokensForOwner(demoAccounts[index])
    }
    //组件初次渲染完毕执行
    componentDidMount() {
        console.log('componentDidMount')
        //触发授权
        connect().then(ownerAddress => {
            console.log('ownerAddress:', ownerAddress)
            this.renderTokensForOwner(ownerAddress)
            this.setState({ currentAddress: ownerAddress })
        })
        //如果已经登陆
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                console.log('accountsChanged:', accounts)
                this.setState({ currentAddress: accounts[0] })
                this.renderTokensForOwner(accounts[0])
            })
        }
    }

    render() {
        const { currentAddress, nfts } = this.state
        return (
            <div className='pageContainer'>
                <h1>OpenSea API 的接入</h1>
                <button className='nice-button' onClick={() => this.changeDemoAccount(0)}>加载账户「我的」</button>
                <button className='nice-button' onClick={() => this.changeDemoAccount(1)}>加载测试账户「测试A」</button>
                <button className='nice-button' onClick={() => this.changeDemoAccount(2)}>加载测试账户「测试B」</button>
                <button className='nice-button' onClick={() => this.changeDemoAccount(3)}>加载测试账户「测试C」</button>
                <h4>
                    {'当前账户:' + currentAddress}
                </h4>
                <div className="nfts-container">
                    {nfts}
                </div>
                <div className="bottom-container">
                    {this.state.previousPageCursor && <button className='nice-button' onClick={this.loadPreviousPage}>加载上一页</button>}
                    {this.state.nextPageCursor && <button className='nice-button' onClick={this.loadNextPage}>加载下一页</button>}
                    {!this.state.nextPageCursor && !this.state.previousPageCursor && <h4>没有更多了</h4>}
                </div>
            </div>
        );
    }
}

export default NFTsDemo;

