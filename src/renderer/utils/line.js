import {sendEmail} from './email'
import * as utils from './count'
import { Loading } from 'element-ui';
const Store = require('electron-store');
const store = new Store();
/**
 * 计算均线
 */
// export function calculateAverage(n,m,data){
//     var newData = []
//     for(var i =n-1;i<data.length;i++){
//         var count = 0;
//         var sdnns = []
//         var sdnn = 0
//         for(var j = 1+i-n;j<n;j++){
//             count+=data[j].close
//             sdnns.push(data[j].close)
//         }
//         count /=n
//         for(var i_1=0;i_1<sdnns.length;i_1++){
//             sdnn += (sdnns[i_1] - count)**2
//         }
//         sdnn /= n
//         sdnn = Math.sqrt( sdnn ) 
//         newData.push({
//             middle:count,
//             top:count+sdnn,
//             down:count - sdnn
//         })
//     }
//     return newData
// }

export function calculateAverage(n,m,data){
    var newData = []
    for(var i =n;i<data.length;i++){
        var count = 0;
        var sdnns = []
        var sdnn = 0
        for(var j = i-n;j<i;j++){
            count+=data[j].close
            sdnns.push(data[j].close)
        }
        count /=n
        for(var i_1=0;i_1<sdnns.length;i_1++){
            sdnn += (sdnns[i_1] - count)**2
        }
        sdnn /= n
        sdnn = Math.sqrt( sdnn ) * m
        newData.push({
            middle:count,
            top:count+sdnn,
            down:count - sdnn,
            time:new Date(data[n].id*1000)
        })
    }
    return newData
}

/**
 * 获得策略
 * @param {服务} service 
 * @param {周期数} period 
 * @param {n} size 
 */
export function getStrategy(service,period,size){
    service.kline({period:period,size:size}).then(res=>{
        return calculateAverage(size,2,res.data)
    })
}

/**
 * 策略优化
 * @param {训练集} train 
 * @param {验证集合} verify 
 * @param {训练批次} batch
 * @param {学习率} learning
 */
export function optimizeStrategy(train,strategyInfo,setDateFlg=false){
    let loadingInstance = Loading.service(
        {
        lock: true,
          text: '训练中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
    );
    var n = parseInt(strategyInfo.n+'')
    var m = parseFloat(strategyInfo.m+'')
    var learning = 0.01
    var batch = 1
    var zuida = 0;
    var zuida_m = 0;
    var ret = {};
    var historyPolicy = []
    for(var _ = 0;_<batch;_--){
        var record = [0,0]
        var money = 1000
        var order = {status:-1,cost_open:0}
        var trainsStrategy = calculateAverage(n,m,train);
        var clLine = [];
        var placeInfo = store.get('placeInfo')||{transactionType:[1,2],leverage:1}
        for(var i = n+1;i<train.length;i++){
            var lineInfo = JSON.parse(JSON.stringify(train[i]))
            if(order.status == -1 ){
                // 买多
                // 暂时不做多
                if(placeInfo.transactionType.indexOf(1)!=-1 && train[i-1].low<=trainsStrategy[i-n-1].down && train[i].low>trainsStrategy[i-n].down){
                    order.status = 1
                    order.cost_open = train[i].close
                    lineInfo.status = 1
                // 买空
                }else if(placeInfo.transactionType.indexOf(2)!=-1 && train[i-1].close>=trainsStrategy[i-n-1].top && train[i].close<trainsStrategy[i-n].top){
                    order.status = 2
                    order.cost_open = train[i].close
                    lineInfo.status = 2
                }
            }else if(order.status != -1){
                if(train[i]){
                    // 平多
                    if((placeInfo.transactionPrice && placeInfo.transactionPrice!=-1 && order.status == 1 && calculateEarnings(order,train[i]) * placeInfo.leverage>= placeInfo.transactionPrice)|| order.status == 1 && train[i-1].close>=trainsStrategy[i-n-1].middle && train[i].close<trainsStrategy[i-n].middle){
                       
                       order.status = -1
                       // var zhanbi = order.cost_open/1000;
                       var earnings = money* calculateEarnings(order,train[i]) * placeInfo.leverage
                       money += earnings
                       lineInfo.status = 0
                       lineInfo.profit = earnings
                       if(earnings>0){
                           record[0] = record[0]+1
                       }else{
                           record[1] = record[1]+1
                       }
                    // 平空
                    }else if((placeInfo.transactionPrice && placeInfo.transactionPrice!=-1 && order.status == 2 && calculateEarnings({cost_open:train[i].close},{close:order.cost_open}) * placeInfo.leverage>= placeInfo.transactionPrice)|| order.status == 2 && train[i-1].close<=trainsStrategy[i-n-1].middle && train[i].close>trainsStrategy[i-n].middle){
                        order.status = -1
                       // var zhanbi = order.cost_open/1000;
                    //    debugger
                       var newLine = {close:order.cost_open}
                       var ord = {cost_open:train[i].close}
                       var earnings = money* calculateEarnings(ord,newLine) * placeInfo.leverage
                       money += earnings
                       lineInfo.status = 0
                       lineInfo.profit = earnings
                       if(earnings>0){
                           record[0] = record[0]+1
                       }else{
                           record[1] = record[1]+1
                       }
                    }
                }
            }
            
            
            
            else if(order.status == -999){
                if(train[i]){
                // 收益占比
                var proportion = calculateEarnings(order,train[i])
                var zhanbi = order.cost_open/money;
                if(proportion >0.05){
                    order.status = -1
                    money += money * proportion
                    if(money * proportion>0){
                        record[0] = record[0]+1
                    }else{
                        record[1] = record[1]+1
                    }
                }
            }
            }
            if(lineInfo.status == null){
                lineInfo.status = '-'
            }
            lineInfo.price = train[i].close
            lineInfo.time = new Date(lineInfo.id*1000)
            clLine.push(lineInfo)
        }
        if(money>zuida){
            zuida = money
            zuida_m = m
            ret['line'] = clLine;
            ret['cl'] = trainsStrategy.slice(1,trainsStrategy.length)
            historyPolicy.push({total:money-1000,profit:((money-1000)/1000*100),status:[...record],n:n,m:m})
        }
        console.log('总收益：',money, ((money-1000)/1000*100)+"%",'盈利：'+record[0],'亏损：'+record[1],'参数:'+m,'最大:',zuida,'最大M:',zuida_m)
        money = 1000
        order.status = -1
        if(setDateFlg){
            strategyInfo.status = record
            break
        }
        m = m - (m*learning)
        if(m<1){
            break;
        }
    }
    loadingInstance.close();
    
    historyPolicy = historyPolicy.sort(utils.compare("total",false))
    return {...ret,historyPolicy:historyPolicy};
}

/**
 * 下单
 * @param {k线数据}} lineList 
 * @param {当前订单} order 
 * @param {布林带} trainsStrategy 
 */
function deal(lineList,order,trainsStrategy){
    // 下单操作状态
    var status = -1
    var commission = 1000*0.0008
    var record = store.get('record') || [0,0]
    // var trainsStrategy = calculateAverage(n,m,lineList);
    // 根据前一根的收盘价下单
    var i = lineList.length-1
        var lineInfo = JSON.parse(JSON.stringify(lineList[i]))
        if(order.status == -1 ){
            var transactionType = store.get('placeInfo').transactionType || [1,2]
            if(transactionType.indexOf(1)!= -1 && lineList[i-1].low<=trainsStrategy[trainsStrategy.length-2].down && lineList[i].close>trainsStrategy[trainsStrategy.length-1].down){
                var emailInfo = store.get('mailInfo')
                order.status = 1
                lineInfo.status = order.status
                order.cost_open = lineList[i].close.toFixed(2),
                order.id = lineList[i].id
                order.time = new Date(order.id*1000)
                order.direction = 'buy'
                var orders = store.get('orders') || []
                orders.push({...lineInfo,...order,status:order.status})
                store.set('orders',orders)
                status = order.status
                if(emailInfo&&emailInfo.send[0] == 1){
                    sendEmail({subject:'发起买入指令',text:'买入价格:'+order.cost_open})
                }
            }else if(transactionType.indexOf(2)!= -1 && lineList[i-1].close>=trainsStrategy[trainsStrategy.length-2].top && lineList[i].close<trainsStrategy[trainsStrategy.length-1].top){
                order.status = 2
                order.direction = 'sell'
                lineInfo.status = order.status
                order.cost_open = lineList[i].close.toFixed(2)
                order.id = lineList[i].id
                order.time = new Date(order.id*1000)
                var orders = store.get('orders') || []
                orders.push({...lineInfo,...order,status:order.status})
                store.set('orders',orders)

                status = order.status
                if(emailInfo&&emailInfo.send[1] == 2){
                    sendEmail({subject:'发起卖出指令',text:'卖出价格:'+order.cost_open})
                }
            }
        }else
        if(order.status != -1){
            var  transactionPrice = store.get('placeInfo').transactionPrice || -1
            // 杠杆
            var leverage = store.get('placeInfo').leverage
            if(lineList[i]){
                if((order.status == 1 && transactionPrice!=-1 && (lineList[i].close - order.cost_open) / order.cost_open * leverage >= transactionPrice) || order.status == 1 && lineList[i-1].close>=trainsStrategy[trainsStrategy.length-2].middle && lineList[i].close<trainsStrategy[trainsStrategy.length-1].middle){
                    // 总收入
                    // var earnings = store.get('earnings')
                    // 邮箱
                    var emailInfo = store.get('mailInfo')
        
                    // var money = earnings.money || 1000
                    var earnings = {}
                    status = 0
                    order.status = -1
                    order.direction = 'sell'
                    order.id = lineList[i].id
                    order.time = new Date(order.id*1000)
                    var orders = store.get('orders') || []
                    orders.push({...order,...lineInfo,status:0})
                    store.set('orders',orders)
                    // 计算当前收益占比
                    // var ce = calculateEarnings(order,lineList[i])
                    var ce = (lineList[i].close - order.cost_open) / order.cost_open
                    // 设置K线信息状态
                    lineInfo.status = 0
                    // 总收益比 = 收益 * 杠杆
                    earnings.profit_rate =  ce * leverage
                    // 总收益金额 = 总收益比 * 当前金额 - 手续费
                    earnings.profit = earnings.profit_rate * 1000 - commission
                    // 存储
                    // store.set('earnings',earnings)
        
                    if(earnings.profit_rate>0){
                        record[0] = record[0]+1
                    }else{
                        record[1] = record[1]+1
                    }
                    if((order.status == 1 && transactionPrice!=-1 && ((lineList[i].close - order.cost_open) / order.cost_open) *leverage >= transactionPrice)){
                        sendEmail({subject:'止盈(买入)',text:'收益情况:'+earnings.profit+','+(earnings.profit_rate*100)+'%,[盈利,亏损]次数：'+record})
                    }
                    // 发送邮件
                    if(emailInfo&&emailInfo.send[2] == 3){
                        sendEmail({subject:'发起平仓指令(买入)',text:'收益情况:'+earnings.profit+','+(earnings.profit_rate*100)+'%,[盈利,亏损]次数：'+record})
                    }

                }else if((order.status == 2 && transactionPrice!=-1 && ((order.cost_open  - lineList[i].close) /  lineList[i].close)*leverage >= transactionPrice) ||  order.status == 2 && lineList[i-1].close<=trainsStrategy[trainsStrategy.length-2].middle && lineList[i].close>trainsStrategy[trainsStrategy.length-1].middle){
                    // 总收入
                    // var earnings = store.get('earnings')
                    // 杠杆
                    var leverage = store.get('placeInfo').leverage
                    // 邮箱
                    var emailInfo = store.get('mailInfo')
        
                    // var money = earnings.money || 1000
                    var earnings = {}
                    status = 0
                    order.status = -1
                    order.direction = 'buy'
                    order.id = lineList[i].id
                    order.time = new Date(order.id*1000)
                    var orders = store.get('orders') || []
                    orders.push({...order,...lineInfo,status:0})
                    store.set('orders',orders)
                    // 计算当前收益占比
                    // var ce = calculateEarnings(order,lineList[i])
                    var ce = (order.cost_open  - lineList[i].close) /  lineList[i].close
                    // 设置K线信息状态
                    lineInfo.status = 0
                    // 总收益比 = 收益 * 杠杆
                    earnings.profit_rate =  ce * leverage
                    // 总收益金额 = 总收益比 * 当前金额 - 手续费
                    earnings.profit = earnings.profit_rate * 1000 - commission
                    // 存储
                    // store.set('earnings',earnings)
        
                    if(earnings.profit_rate>0){
                        record[0] = record[0]+1
                    }else{
                        record[1] = record[1]+1
                    }
                    if((order.status == 2 && transactionPrice!=-1 && ((order.cost_open  - lineList[i].close) /  lineList[i].close)*leverage >= transactionPrice)){
                        sendEmail({subject:'止盈(卖出)',text:'收益情况:'+earnings.profit+','+(earnings.profit_rate*100)+'%,[盈利,亏损]次数：'+record})
                    }
                    // 发送邮件
                    if(emailInfo&&emailInfo.send[2] == 3){
                        sendEmail({subject:'发起平仓指令(卖出)',text:'收益情况:'+earnings.profit+','+(earnings.profit_rate*100)+'%,[盈利,亏损]次数：'+record})
                    }
                }
            }
        }
        
        if(lineInfo.status == null){
            lineInfo.status = '-'
        }
        lineInfo.price = lineList[i].close
        lineInfo.time = new Date(lineInfo.id*1000)
        store.set('record',record)
        if(status !=-1){
            return {lineInfo,status}
        }
        return null
}

/**
 * 计算收益情况
 * @param {当前订单} order 
 * @param {最新K线数据} newLine 
 */
export function calculateEarnings(order,newLine){
    // 当前收益率 = (最新价格 - 成交价格)  / 成交价格
    return (newLine.close - order.cost_open) / order.cost_open
}

/**
 * 实盘实时数据
 * @param {k线数据}} lineList 
 * @param {n} n 
 * @param {m} m 
 */
export function satrtActual(lineList,n,m,order){
    var trainsStrategy = calculateAverage(n,m,lineList);
    var clLine = [];
    for(var i = n+1;i<lineList.length;i++){
        var lineInfo = JSON.parse(JSON.stringify(lineList[i]))
        
        if(lineInfo.status == null){
            lineInfo.status = '-'
        }
        lineInfo.price = lineList[i].close
        lineInfo.time = new Date(lineInfo.id*1000)
        clLine.push(lineInfo)
    }
    // var orders = store.get('orders') || []
    // utils.getInsertIndex(clLine,orders)
    var cl = deal(lineList,order,trainsStrategy)
    var status = -1
    if(cl){
        // i = ord
        clLine[clLine.length-1] = cl.lineInfo
        status = cl.status
        
    }
    return {line:clLine,cl:trainsStrategy.slice(1,trainsStrategy.length),status}
}