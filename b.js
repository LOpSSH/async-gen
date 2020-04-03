const util = require('util');

function async_2() {
    return new Promise((resolve, reject) => resolve('1312312312312313123123'));
}

function async_1() {
    return async_gen(function *(){
        let x = (yield 'haha') + (yield async_2());
        return x + '+hoho';
    });
}

function async_0() {
    return async_gen(function *(){
        let x = yield 1;
        x += 100;
        let y = yield async_1();
        y += '_pwpow';
        return x + '' + y;
    });
}

+function () {
    console.log(`[ entry ] : 开始生成器`);
    // let promise = async_gen(foo)
    let promise = async_0();
    console.log(`[ entry ] : 完成生成器，获得了：${util.inspect(promise)}`);
    promise.then((it)=> { console.log(`[ final promise ]最终结果：${it}`) } );
} ();

async function join_str_2(str) {
    console.log('[ join_str_2 ]: 异步上下文C')
    return str + '_#AAA';
}

function * join_str_1() {
    console.log('[ join_str_1 ]: 异步上下文A')
    let v = yield 100;
    console.log('[ join_str_1 ]: 异步上下文B')
    v *= 2;
    v = yield join_str_2(v);
    console.log('[ join_str_1 ]: 异步上下文D')
    return v + "_#BBB";
}

function * foo() {
    console.log('[ foo ]: 外包层开始')
    let v = yield async_gen(join_str_1);
    let x = yield 100;
    console.log('[ foo ]: 外包层结束')
    return v + '' + x;
}

/* 该函数模拟async，await */
function async_gen(gen) {
    let promise = new Promise((resolve, reject)=>{
        let generator = gen();
        (function _fn(input) {
            let next = generator.next(input);
            let value = next.value;
            if (next.done === true) {
                resolve(value);
            } else {
                let promise2 = null;
                if (value instanceof Promise) {
                    promise2 = value;
                } else {
                    promise2 = new Promise((_resolve, _reject) => _resolve(value));
                }
                promise2.then(it=> _fn(it));
            }
        })(null);
    });
    return promise;
}
