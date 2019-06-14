const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const privateKeys = ["5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr", "5KPr55J2UQNUh3xP5Q6ebqqV6MK5usrXxG4qqRfpaLieGa8VpCm", "5HqyipkJSm5fwYhbhGC3vmmoBwabtgJSPecnvmN2mMrCTQfWBSS"];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://192.168.222.6:51043', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
console.log(api);

// const result = api.transact({
//     actions: [{
//         account: 'eosio',
//         name: 'newaccount',
//         authorization: [{
//             actor: 'useraaaaaaaa',
//             permission: 'active',
//         }],
//         data: {
//             creator: 'useraaaaaaaa',
//             name: 'lwwwaaatest1',
//             owner: {
//                 threshold: 1,
//                 keys: [{
//                     key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
//                     weight: 1
//                 }],
//                 accounts: [],
//                 waits: []
//             },
//             active: {
//                 threshold: 1,
//                 keys: [{
//                     key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
//                     weight: 1
//                 }],
//                 accounts: [],
//                 waits: []
//             },
//         },
//     },
//     {
//         account: 'eosio',
//         name: 'buyrambytes',
//         authorization: [{
//             actor: 'useraaaaaaaa',
//             permission: 'active',
//         }],
//         data: {
//             payer: 'useraaaaaaaa',
//             receiver: 'mynewaccount',
//             bytes: 8192,
//         },
//     },
//     {
//         account: 'eosio',
//         name: 'delegatebw',
//         authorization: [{
//             actor: 'useraaaaaaaa',
//             permission: 'active',
//         }],
//         data: {
//             from: 'useraaaaaaaa',
//             receiver: 'mynewaccount',
//             stake_net_quantity: '1.0000 SYS',
//             stake_cpu_quantity: '1.0000 SYS',
//             transfer: false,
//         }
//     }]
// }, {
//         blocksBehind: 3,
//         expireSeconds: 30,
//     });
// console.log(result);
