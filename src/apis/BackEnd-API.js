import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_EXPRESS_BACKEND_URL

const api = axios.create({
    baseURL: `http://${BACKEND_URL}/`,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});
// 拦截请求，给所有的请求都带上token
api.interceptors.request.use(request => {
    const chaos_jwt_token = window.localStorage.getItem('chaos_jwt_token');
    if (chaos_jwt_token) {
        request.headers['Authorization'] = `Bearer ${chaos_jwt_token}`;
    }
    return request;
});

const verifyJWT = (publicAddress) => {
    const params = new URLSearchParams();
    params.append('publicAddress', publicAddress);
    //TODO 测试验证jwt 如果地址对应可以直接续签
    return new Promise((resolve, reject) => {
        api.post('/users/verifyJWT', params)
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
    })

}

const getRandomItem = () => {
    return new Promise((resolve, reject) => {
        api.get('/gallery/random').then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}




const getSharedGallery = (address) => {
    return new Promise((resolve, reject) => {
        api.get(`/gallery/share/${encodeURI(address)}`).then(res => {
            console.log('api get shared gallery:', res)
            resolve(res)
        }).catch(err => { console.warn(err); reject(err) })
    })
}
const getGallery = () => {
    return new Promise((resolve, reject) => {
        api.get('/gallery/get').then(res => {
            console.log('api get gallery:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) })
    })
}

/**
 * 向后端更新数据
 * @param {*} item.itemID
 * @param {*} item.pX
 * @param {*} item.pY
 * @param {*} item.pZ
 * @param {*} item.rX
 * @param {*} item.rY
 * @param {*} item.rZ
 */
const updateGalleryItem = (item) => {
    const params = new URLSearchParams();
    params.append('itemID', item.itemID);
    params.append('pX', item.pX);
    params.append('pY', item.pY);
    params.append('pZ', item.pZ);
    params.append('rX', item.rX);
    params.append('rY', item.rY);
    params.append('rZ', item.rZ);
    return new Promise((resolve, reject) => {
        api.post('/gallery/update', params)
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
    })
}
/**
 * 向后端缓存数据
 * @param {*} item.itemID
 * @param {*} item.pX
 * @param {*} item.pY
 * @param {*} item.pZ
 * @param {*} item.rX
 * @param {*} item.rY
 * @param {*} item.rZ
 */
const addGalleryItem = (item) => {
    const params = new URLSearchParams();
    params.append('itemID', item.itemID);
    params.append('pX', item.pX);
    params.append('pY', item.pY);
    params.append('pZ', item.pZ);
    params.append('rX', item.rX);
    params.append('rY', item.rY);
    params.append('rZ', item.rZ);
    return new Promise((resolve, reject) => {
        api.post('/gallery/add', params)
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
    })
}




const getCollection = () => {
    return new Promise((resolve, reject) => {
        api.get('/collection/get')
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
    })
}

/**
 * 向后端缓存数据
 * @param {*} collection.itemID
 * @param {*} collection.itemURL 
 * @param {*} collection.itemName
 * @param {*} collection.itemOSURL 
 */
const addCollection = (collection) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append('itemID', collection.itemID);
        params.append('itemURL', collection.itemURL);
        params.append('itemName', collection.itemName);
        params.append('itemOSURL', collection.itemOSURL);
        api.post('/collection/add', params).then(res => {
            console.log('api post collection:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) });
    })
}


const verifySign = (publicAddress, signature) => {
    const params = new URLSearchParams();
    params.append('publicAddress', publicAddress);
    params.append('signature', signature);
    return new Promise((resolve, reject) => {
        api.post('/users/verifySign', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}



//根据地址查询账户是否存在
const getUser = (publicAddress) => {
    console.log('getUser:', publicAddress)
    return new Promise((resolve, reject) => {
        api.get(`/users/query/${publicAddress}`)
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
    })
}


//用户注册，写入地址，后端会生成对应随机数
const signUp = (publicAddress) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        console.log('signUp:', publicAddress)
        params.append('publicAddress', publicAddress);
        api.post('/users/signup', params).then(response => {
            console.log('api post signup:', response)
            if (response.statusText === 'Created') {
                resolve(response.data.data)
            } else {
                reject('注册失败，该地址已存在')
            }
        }).catch(err => {
            reject(err);
        })
    })
}


//数据库测试，异步获取数据
const getTest = () => {
    return new Promise((resolve, reject) => {
        api.get('/test').then(res => {
            console.log('api get test:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) });
    })
}

//数据库测试，异步写入数据
const addTest = (text) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append('name', text);
        api.post('/test', params).then(res => {
            console.log('api post test:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) });
    })
}

//数据库测试，异步删除数据
const delTest = (id) => {
    return new Promise((resolve, reject) => {
        api.delete(`/test/${id}`).then(res => {
            console.log('api delete test:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) });
    })
}

//数据库测试，异步更新数据
const updateTest = (id, text) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append('newname', text);
        api.put(`/test/${id}`, params).then(res => {
            console.log('api put test:', res.data)
            resolve(res.data)
        }).catch(err => { console.warn(err); reject(err) });
    })
}


export {
    getTest,
    addTest,
    delTest,
    updateTest,
    signUp,
    getUser,
    verifySign,
    verifyJWT,
    addCollection,
    getCollection,
    addGalleryItem,
    getGallery,
    updateGalleryItem,
    getSharedGallery,
    getRandomItem
}
