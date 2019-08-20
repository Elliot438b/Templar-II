const {Api, JsonRpc} = require('eosjs');
const {JsSignatureProvider} = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const {TextDecoder, TextEncoder} = require('util');               // node only
const privateKeys = ["5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://192.168.222.6:51043', {fetch});
const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});
(async () => {
    const result = await api.transact({
        actions: [{
            account: 'useraaaaaaaa', // 合约部署者，是一个EOS账户
            name: 'hi',              // 调用方法名，hello合约的一个方法。
            authorization: [{        // 该方法需要的权限，默认为合约部署者权限
                actor: 'useraaaaaaaa',
                permission: 'active',
            }],
            data: {                 // 方法参数
                nm: 'water'
            },
        }]
    }, {
        blocksBehind: 3,            // 顶部区块之前的某区块信息作为引用数据，这是TAPoS的概念。
        expireSeconds: 3,          // 延迟时间设置，自动计算当前区块时间加上延迟时间，得到截止时间。
    });
})();