import {baseUrl} from '../config/env'
import * as apis from '../config/webSocketApi'
import pako from 'pako'
import Rwebsocket from 'reconnecting-websocket';
import {contract_code as contractCode} from '@/config/env'
var timerId = null
// 实盘k线数
var size = 300
/**
 * 创建Wss连接
 */
export function creationWss(contract_code=contractCode,period='1min',onmessage=function(){}){
    return new Promise((resolve, reject) => {
    
    var Socket = new Rwebsocket('ws://'+baseUrl+apis.linear_swap_ws, null, { debug: false, reconnectInterval: 3000 });

    Socket.onopen = (res) => {
        console.log('连接成功')
        var c = {Socket,'getLine':null,'subLine':null}
        c.getLine = (data={})=>{
            var period_1 = data.period ||period
            var totality = data.totality|| size
            var code = data.contract_code || contract_code
            var p =parseInt(period_1.replace('min',''))
            var time = totality * p / 60
            var date = new Date()
            // var date = new Date('2021-01-21 22:42:00')
            let to = parseInt(date.getTime()/1000)
            let from = 0
            if(time>=24){
                from = parseInt(date.setDate(date.getDate()-parseInt(time/24)) / 1000) 
            }else{
                from = parseInt(date.setHours(date.getHours()-time) / 1000) 
            }
            Socket.send(JSON.stringify({from,to,...apis.req_line({contract_code:code,period:period_1})}))
        }
        c.subLine = (data={})=>{
            var period_1 = data.period ||period
            var code = data.contract_code || contract_code
            console.log('发送订阅消息',JSON.stringify(apis.sub_line({contract_code:code,period:period_1})))
            // Socket.send(JSON.stringify(apis.sub_line({contract_code:code,period:period_1})))
        }
        resolve(c)
    }
    Socket.onmessage = (event) => {
        let blob = event.data;
        let reader = new FileReader();
        reader.onload = function (e) {
            let ploydata = new Uint8Array(e.target.result);
            let msg = pako.inflate(ploydata, {to: 'string'});
            if(msg&&msg.indexOf('ping')!=-1){
                sendHeartbeat(Socket,msg)
            }else{
                onmessage(msg)
            }
        };
        reader.readAsArrayBuffer(blob, "utf-8");
    }
    Socket.onerror = (res) => {
		console.log('发生了错误',res)
    }
    Socket.onclose = (res) => {
		console.log('连接已经被关闭',res)
    }
    })
}

function sendHeartbeat(Socket,msg){
    Socket.send(msg.replace('ping','pong'))
    // console.log('发送心跳',msg)

}
export function getLine(Socket,contract_code=contractCode,period='1min',totality){
    totality = totality|| size
    var date = new Date();
    var p =parseInt(period.replace('min',''))
    var time = totality * p / 60
    var date = new Date();
    let to = parseInt(date.getTime()/1000)
    let from = 0
    if(time>=24){
        from = parseInt(date.setDate(date.getDate()-parseInt(time/24)) / 1000) 
    }else{
        from = parseInt(date.setMinutes(date.getMinutes()-time) / 1000) 
    }
    Socket.send(JSON.stringify({from,to,...apis.req_line({contract_code,period})}))
}
export function subLine(Socket,contract_code=contractCode,period='1min'){
    var period_1 = data.period ||period
    var code = data.contract_code || contract_code
    console.log('订阅Line')
    Socket.send(JSON.stringify(apis.sub_line({contract_code:code,period:period_1})))
}