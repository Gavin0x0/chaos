const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY


/**
 * 通过API获取NFTs，返回列表
 * @param {*} owner address
 * @param {*} limit 20-50
 * @param {*} cursor 分页光标，🔎 详见 https://docs.opensea.io/changelog/cursor-pagination
 * @param {*} orderDirection desc/asc
 * @param {*} includeOrders true/false
 * @returns {Promise}   返回Promise 包含「assets,next,previous」
 * 
 */
const RetrieveAssets = (params) => {
    const { owner = '0xb65893E83bbD9FA5326446251E32Cab8eCC01544',
        order_direction = 'desc',
        limit = 20,
        cursor = '', //可能包含符号，需要转义
        include_orders = false } = params
    //OpenSea API
    const options = {
        method: 'GET',
        headers: { Accept: 'application/json', 'X-API-KEY': OPENSEA_API_KEY }
    };
    return new Promise(async (resolve, reject) => {
        try {
            fetch(`https://api.opensea.io/api/v1/assets?owner=${owner}&order_direction=${order_direction}&limit=${limit}&cursor=${encodeURI(cursor)}&include_orders=${include_orders}`, options)
                .then((res) => {
                    //判断返回值是否合法
                    if (res.ok) {
                        return res.json()
                    } else {
                        //抛出错误编码
                        reject('请求出错，错误编号：' + res.status)
                    }
                }
                )
                .then((res) => {
                    resolve(res)
                })
                .catch(err => { console.warn(err); reject(err) });
        } catch (err) {
            console.warn(err)
            reject(err)
        }
    })

}


export default RetrieveAssets