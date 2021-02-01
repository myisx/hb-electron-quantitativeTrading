// import {contract_code} from './env'
// 市场行情=========start==========

// 订阅Kline数据
export function sub_line({contract_code,period}){
    return {"sub": "market."+contract_code+".kline."+period}
}
// 请求Kline数据
export function req_line({contract_code,period}){
    return {"req": "market."+contract_code+".kline."+period}
}

/**
 * 市场行情接口
 */
export const linear_swap_ws= '/linear-swap-ws'
// 市场行情=========end==========



