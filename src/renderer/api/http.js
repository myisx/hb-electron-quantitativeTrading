import request from 'request-promise'
import { Loading } from 'element-ui';

import {urlEncode} from '../utils/url'
import {createSignature} from '../utils/ApiSignature'
import {http,baseUrl,baseUrl_2} from '../config/env'
// export function GET(api,data){
//     return new Promise((resolve, reject) => {
//     let loadingInstance = Loading.service(
//         {
//         lock: true,
//           text: 'Loading',
//           spinner: 'el-icon-loading',
//           background: 'rgba(0, 0, 0, 0.7)'
//         }
//     );
//     request({
//         uri:http+baseUrl+api+urlEncode({...data,...createSignature(baseUrl,api,"GET")},1),
//         method: 'GET',
//         json:true
//       }).then(res => {
//         loadingInstance.close();
//         resolve(res)
//     }).catch(e=>{
//         loadingInstance.close();
//         reject(e)
//     })
//     })
// }

// export function POST(api,data){
//     var url = http+baseUrl+api+urlEncode({...createSignature(baseUrl,api,"POST")},1)
//     return new Promise((resolve, reject) => {
//         let loadingInstance = Loading.service(
//             {
//             lock: true,
//               text: 'Loading',
//               spinner: 'el-icon-loading',
//               background: 'rgba(0, 0, 0, 0.7)'
//             }
//         );
//         request({
//             uri:url,
//             method: 'POST',
//             body:data,
//             json:true,
//         }).then(res => {
//             loadingInstance.close();
//             resolve(res)
//         }).catch(e=>{
//             loadingInstance.close();
//             reject(e)
//         })
//     })
// }

export function GET(api,data){
    return new Promise((resolve, reject) => {
    let loadingInstance = Loading.service(
        {
        lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
    );
        fetch(http+baseUrl+api+urlEncode({...data,...createSignature(baseUrl,api,"GET")},1),{
            method: 'GET',
        }).then(res => {
            loadingInstance.close();
            res.json().then(rs=>{
                resolve(rs)
            })
        }).catch(e=>{
            if(e.message && e.message == 'Failed to fetch'){
                console.log('服务器v1 已挂 从v2 请求')
                fetch(http+baseUrl_2+api+urlEncode({...data,...createSignature(baseUrl_2,api,"GET")},1),{
                    method: 'GET',
                }).then(res => {
                    loadingInstance.close();
                    res.json().then(rs=>{
                        resolve(rs)
                    })
                }).catch(e=>{
                    loadingInstance.close();
                    reject(e)
                })
            }else{
                loadingInstance.close();
                reject(e)
            }
            
        })
    })
}
export function POST(api,data){
    var url = http+baseUrl+api+urlEncode({...createSignature(baseUrl,api,"POST")},1)
    console.log('请求url',url)
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service(
            {
            lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            }
        );
        fetch(url,{
            method: 'POST',
            body:JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => {
            loadingInstance.close();
            res.json().then(rs=>{
                resolve(rs)
            })
        }).catch(e=>{
            if(e.message && e.message == 'Failed to fetch'){
                console.log('服务器v1 已挂 从v2 请求')
                fetch(http+baseUrl_2+api+urlEncode({...createSignature(baseUrl_2,api,"POST")},1),{
                    method: 'POST',
                    body:JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                }).then(res => {
                    loadingInstance.close();
                    res.json().then(rs=>{
                        resolve(rs)
                    })
                }).catch(e=>{
                    loadingInstance.close();
                    reject(e)
                })
            }else{
                loadingInstance.close();
                reject(e)
            }
        })
    })
}