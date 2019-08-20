const {Api, JsonRpc} = require('eosjs');
const {JsSignatureProvider} = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const {TextDecoder, TextEncoder} = require('util');               // node only
const privateKeys = ["5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr", "5JUNYmkJ5wVmtVY8x9A1KKzYe9UWLZ4Fq1hzGZxfwfzJB8jkw6u", "5K6LU8aVpBq9vJsnpCvaHCcyYwzPPKXfDdyefYyAMMs3Qy42fUr"];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://192.168.222.6:51043', {fetch});
const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});
(async () => {
        const result = await pubTransfer();
    }
)();


async function pubTransfer() {
    try {
        let info = await rpc.get_info();
        if (info != null && info.chain_id != null && info.head_block_num != null) {
            let chainId = info.chain_id;
            let head_block_num = info.head_block_num;//- blocksBehind;
            let block = await rpc.get_block(head_block_num);
            if (block != null && block.ref_block_prefix != null && block.timestamp != null) {
                // ---------------------------- ①打包Actions ----------------------------
                let actions = [{ // actions结构与上面相同，这是我们与链交互的“个性化参数”
                    account: 'useraaaaaaaa',
                    name: 'hi',
                    authorization: [
                        {
                            actor: 'useraaaaaaaa',
                            permission: 'active'
                        }
                    ],
                    data: {
                        nm: 'seawater'
                    }
                }];
                let sActions = await api.serializeActions(actions);// 打包Actions
                // ---------------------------- ②打包Transaction ----------------------------
                let expireSeconds = 3;                                          // 设置过期时间为3秒
                let blocktime = new Date(block.timestamp).getTime();            // 获得引用区块的时间:1566263146500
                let timezone = new Date(blocktime + 8 * 60 * 60 * 1000).getTime();              // 获得+8时区时间:1566291946500
                let expired = new Date(timezone + expireSeconds * 1000);       // 获得过期时间:2019-08-20T09:05:49.500Z
                let expiration = expired.toISOString().split('.')[0];           // 转换一下，得到合适的值:2019-08-20T09:05:49
                const transaction = {
                    expiration: expiration,                     // 根据延迟时间与引用区块的时间计算得到的截止时间
                    ref_block_num: block.block_num,             // 引用区块号，来自于查询到的引用区块的属性值
                    ref_block_prefix: block.ref_block_prefix,   // 引用区块前缀，来自于查询到的引用区块的属性值
                    max_net_usage_words: 0,                     // 设置该事务的最大net使用量，实际执行时评估超过这个值则自动退回，0为不设限制
                    max_cpu_usage_ms: 0,                        // 设置该事务的最大cpu使用量，实际执行时评估超过这个值则自动退回，0为不设限制
                    compression: 'none',                        // 事务压缩格式，默认为none，除此之外还有zlib等。
                    delay_sec: 0,                               // 设置延迟事务的延迟时间，一般不使用。
                    context_free_actions: [],                   // 这个属性值在中《区块链 + 大数据：EOS存储》有详解https://www.cnblogs.com/Evsward/p/storage.html#context_free_actions
                    actions: sActions,                          // 将前面处理好的Actions对象传入。
                    transaction_extensions: [],                 // 事务扩展字段，一般为空。
                };
                let sTransaction = await api.serializeTransaction(transaction); // 打包事务
                // ---------------------------- ③准备密钥 ----------------------------
                signatureProvider.getAvailableKeys().then(function (avKeys) {// 获得本地可用密钥
                    // 查询事务必须密钥
                    rpc.getRequiredKeys({transaction: transaction, availableKeys: avKeys}).then(function (reKeys) {
                        // 匹配成功：本地可用密钥库中包含事务必须密钥
                        // ---------------------------- ④本地签名 ----------------------------
                        signatureProvider.sign({ // 本地签名。
                            chainId: chainId,
                            requiredKeys: reKeys,
                            serializedTransaction: sTransaction
                        }).then(function (signedTrx) {
                            // ---------------------------- ⑤推送事务 ----------------------------
                            rpc.push_transaction(signedTrx).then(function (result) {
                                console.log(result);
                            })
                        });
                    });
                });
            }
        }
    } catch (e) {
        console.error('Caught exception: ' + e);
    }
}