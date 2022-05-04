//从 OpenSea API 获取 nfts 并缓存
//缓存可采用本地缓存，也可采用网络缓存
import React from "react";
import { ethers } from 'ethers'
import "../styles/NFTsDemo.css";
import { signUp, getUser, verifySign, verifyJWT } from "../apis/BackEnd-API";



class CryptoLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            curAddress: '',
            curNonce: '00000',
            signature: '',
            sign_validate_result: '',
            curJWT: '',
            jwt_validate_result: '',
        };
        this.signer = ''; //钱包签名对象
    }
    //尝试登陆
    handleLogin = (address) => {
        getUser(address).then(users => {
            console.log('users:', users)
            return users
        }).then(users => (users.length ? users[0] : this.handleSignup(address))).then(user => {
            console.log('user:', user)
            this.setState({ curNonce: user.nonce })
            return user
        }).then(this.handleSignMessage)
            .then(this.handleAuthenticate)
            .catch(err => {
                console.warn('登陆失败', err)
            })
    };
    //用私钥签名消息
    handleSignMessage = ({ publicAddress, nonce }) => {
        return new Promise((resolve, reject) => {
            this.signer.signMessage(`通过对一次性随机数进行签名来登陆： ${nonce}`)
                .then(signature => {
                    console.log('signature:', signature)
                    this.setState({ signature })
                    resolve({ publicAddress, nonce, signature })
                }).catch(err => {
                    reject(err)
                })
        })
    }
    //向后端验证签名
    handleAuthenticate = ({ publicAddress, signature }) =>
        new Promise((resolve, reject) => {
            verifySign(publicAddress, signature).then(res => {
                console.log('verifySign:', res)
                this.setState({ sign_validate_result: res.message ? res.message : 'res error' })
                //  如果验证成功，则设置chaos_jwt_token
                if (res.message === 'verify success') {
                    localStorage.setItem('chaos_jwt_token', res.data)
                    //显示当前的JWT
                    this.setState({ curJWT: res.data })
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    //模拟签名验证
    mockValidation = () => {
        const { curAddress, signature } = this.state
        this.handleAuthenticate({ publicAddress: curAddress, signature }).then(res => {
            console.log('mockValidation:', res)
            this.setState({ sign_validate_result: res.message ? res.message : 'res error' })
        })
    }

    //将JWT置空
    handleLogout = () => {
        localStorage.setItem('chaos_jwt_token', '')
        this.setState({ curJWT: '' })
    }

    //模拟JWT验证
    mockVerifyJWT = () => {
        const { curJWT, curAddress } = this.state
        //重新写入JWT
        localStorage.setItem('chaos_jwt_token', curJWT)
        verifyJWT(curAddress).then(res => {
            console.log('mockVerifyJWT:', res)
            this.setState({ jwt_validate_result: res.message ? res.message : 'res error' })
            if (res.message === 'jwt verify success') {
                //更新JWT
                localStorage.setItem('chaos_jwt_token', res.data)
            }
        }
        ).catch(err => {
            console.warn('mockVerifyJWT:', err)
            this.setState({ jwt_validate_result: 'JWT 无效 请登陆' })
            //清空JWT
            localStorage.setItem('chaos_jwt_token', '')
        }
        )
    }



    //注册
    handleSignup = (publicAddress) => signUp(publicAddress).then(res => {
        const user = res
        this.setState({
            result: JSON.stringify(res)
        })
        return user
    }).catch(err => {
        console.warn(err)
    }
    );
    /**
     * 异步请求发起钱包授权并获取钱包地址
     */
    connect = () => {
        return new Promise(async (resolve, reject) => {
            try {
                //通过 provider 连接到以太坊网络，window.ethereum 是 MetaMask 提供的全局变量
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                //MetaMask 需要向用户请求权限才能连接用户帐户，通过RPC调用获取用户的帐户信息
                await provider.send("eth_requestAccounts", [])
                //MetaMask 需要签署交易来发送和支付 ether 以改变区块链内的状态，所以需要获取 signer
                const signer = provider.getSigner()
                this.signer = signer //保存 signer
                const accountAddress = await signer.getAddress()
                resolve(accountAddress)
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    //组件初次渲染完毕执行
    componentDidMount() {
        console.log('componentDidMount')
        //触发授权
        this.connect().then(ownerAddress => {
            console.log('ownerAddress:', ownerAddress)
            this.setState({ curAddress: ownerAddress })
        })
        //查找本地缓存的JWT
        const jwt = localStorage.getItem('chaos_jwt_token')
        if (jwt) {
            this.setState({ curJWT: jwt })
        }
        //如果已经登陆
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                console.log('accountsChanged:', accounts)
                this.setState({ curAddress: accounts[0] })
            })
        }
    }

    render() {
        return (
            <div className='pageContainer' >
                <h1>MetaMask 加密登陆测试</h1>
                <div className="input-head">连接钱包时如果账户不存在会触发自动注册</div>
                <button className='nice-button' onClick={() => this.handleLogin(this.state.curAddress)}>连接钱包「如果账户不存在会触发自动注册」</button>
                <button className='nice-button' onClick={() => this.handleSignup(this.state.curAddress)}>用当前地址注册</button>
                <div className="input-head">当前地址</div>
                <input className="text-input" type='text' value={this.state.curAddress} onChange={(e) => { this.setState({ curAddress: e.target.value }) }} />
                <div className="input-head">当前账户随机数</div>
                <input className="text-input" type='text' value={this.state.curNonce} onChange={(e) => { this.setState({ curNonce: e.target.value }) }} />
                <div className="input-head">当前加密签名的消息</div>
                <input className="text-input" type='text' value={this.state.signature} onChange={(e) => { this.setState({ signature: e.target.value }) }} />
                <div className="input-head">Sign验签结果(模拟签名验证会失败，因为随机数没更新)</div>
                <input className="text-input" type='text' value={this.state.sign_validate_result} onChange={(e) => { this.setState({ sign_validate_result: e.target.value }) }} />
                <button className='nice-button' onClick={this.mockValidation}>模拟签名验证</button>
                <div className="input-head">当前的JWT</div>
                <input className="text-input" type='text' value={this.state.curJWT} onChange={(e) => { this.setState({ curJWT: e.target.value }) }} />
                <button className='nice-button' onClick={this.handleLogout}>清空JWT(注销)</button>
                <div className="input-head">JWT验证结果</div>
                <input className="text-input" type='text' value={this.state.jwt_validate_result} onChange={(e) => { this.setState({ jwt_validate_result: e.target.value }) }} />
                <button className='nice-button' onClick={this.mockVerifyJWT}>验证JWT</button>
                <h4>{this.state.result}</h4>
            </div>
        );
    }
}

export default CryptoLogin;

