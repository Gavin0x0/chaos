import { ethers } from 'ethers'
import { signUp, getUser, verifySign, verifyJWT } from "../apis/BackEnd-API";
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


/**
 * 处理登陆
 * @param {*} address 
 * @returns address
 */
const handleLogin = (address) => new Promise((resolve, reject) =>
    getUser(address)
        .then(users => (users.length ? users[0] : signUp(address)))
        .then(handleSignMessage)
        .then(handleAuthenticate)
        .then(res => {
            console.log('Auth Validation:', res.message)
            resolve(address)
        })
        .catch(err => {
            reject(err)
            console.warn('登陆失败', err)
        })
)

//用私钥签名消息
const handleSignMessage = ({ publicAddress, nonce }) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    signer.signMessage(`通过对一次性随机数进行签名来登陆： ${nonce}`)
        .then(signature => {
            console.log('signature:', signature)
            resolve({ publicAddress, nonce, signature })
        }).catch(err => {
            reject(err)
        })
})

//向后端验证签名
const handleAuthenticate = ({ publicAddress, signature }) =>
    new Promise((resolve, reject) => {
        verifySign(publicAddress, signature).then(res => {
            console.log('verifySign:', res.message)
            //  如果验证成功，则设置chaos_jwt_token
            if (res.message === 'verify success') {
                localStorage.setItem('chaos_jwt_token', res.data)
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })

/**
 * 处理登陆事件
 * 如果JWT可用且地址正确直接续签
 */
const Login = () => {
    return new Promise((resolve, reject) => {
        connect().then(address => {
            handleLogin(address).then(
                res => resolve(res)
            )
        })
        if (window.ethereum) {
            console.log('已登陆')
            window.ethereum.on('accountsChanged', accounts => {
                resolve(accounts[0])
            })
        }
    })
}


export { Login }


