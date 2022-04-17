import React from "react";
import { ethers } from 'ethers'
import "../css/nftCard.css";
const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY

//发起钱包授权
const connect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const accountAddress = await signer.getAddress()
      resolve(accountAddress)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
//渲染NFT列表
const createOpenseaTokenElement = ({ name, collection, description, permalink, image_preview_url, token_id }) => {
  return (
    <section key={token_id} className="nft-card" id={`${collection.slug}_${token_id}`}>
      <h5>{name}</h5>
      <a href={permalink}>
        <img className="nft-img" src={image_preview_url} alt={description} />
      </a>
    </section>
  )
}

class Example6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nfts: [],
      currentAddress: '',
    };
  }

  //加载地址中的NFTs并渲染NFT列表
  renderTokensForOwner = (ownerAddress) => {
    //OpenSea API
    const options = {
      method: 'GET',
      headers: { Accept: 'application/json', 'X-API-KEY': OPENSEA_API_KEY }
    };

    fetch(`https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&limit=20&include_orders=false`, options)
      .then(response => response.json())
      .then(({ assets }) => {
        assets.forEach((attributes) => {
          this.setState({ nfts: [...this.state.nfts, createOpenseaTokenElement(attributes)] })
        })
      })
      .catch(err => console.error(err));
  }
  //更换授权账户
  changeDemoAccount = () => {
    const demoAccount = '0x42F9Ca5c15Af094B9EEE30DcD16d14C3883Aa9f7'
    const demoAccount2 = '0xb65893E83bbD9FA5326446251E32Cab8eCC01544'
    this.renderTokensForOwner(demoAccount)
    this.renderTokensForOwner(demoAccount2)
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
      <div>
        <h4>
          {'OPENSEA_API_KEY:' + process.env.REACT_APP_OPENSEA_API_KEY}
        </h4>
        <h4>
          {'Address:' + currentAddress}
        </h4>
        <div className="nfts-container">
          {nfts}
        </div>
        <button onClick={this.changeDemoAccount}>加载测试账户</button>
      </div>
    );
  }
}

export default Example6;

