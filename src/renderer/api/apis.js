import {GET,POST} from './http'
// import {contract_code} from '@/randerer/config/env'
import {contract_code} from '@/config/env'
/**
 * 获得行情数据
 * @param {指定币种行情}} data 
 */
export function swap_index(data={}){
    data.contract_code = contract_code
    return GET('/linear-swap-api/v1/swap_index',data)
}
/**
 * 
 * @param {k线数据} data 
 */
export function kline(data={}){
    data.contract_code = contract_code
    return GET('/linear-swap-ex/market/history/kline',data)
}

/**
 * 获取账户信息
 * @param {数据} data 
 */
export function swap_account_info(data={}){
    // data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_account_info',data)
}

/**
 * 获取用户持仓数据
 * @param {数据} data 
 */
export function swap_position_info(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_position_info',data)
}

/**
 * 查询用户财务数据
 * @param {数据} data 
 */
export function swap_financial_record(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_financial_record',data)
}

/**
 * 查询用户可用杠杆倍数
 * @param {数据} data 
 */
export function swap_available_level_rate(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_available_level_rate',data)
}

/**
 * 查询用户手续费率
 * @param {数据} data 
 */
export function swap_fee(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_fee',data)
}

/**
 * 合约下单
 * @param {数据} data 
 */
export function swap_order(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_order',data)
}

/**
 * 全部撤单
 * @param {数据} data 
 */
export function swap_cancelall(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_cancelall',data)
}

/**
 * 获取订单信息
 * @param {数据} data 
 */
export function swap_order_info(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_order_info',data)
}

/**
 * 获取订单明细
 * @param {数据} data 
 */
export function swap_order_detail(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_order_detail',data)
}

/**
 * 获取未成交的委托
 * @param {数据} data 
 */
export function swap_openorders(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_openorders',data)
}

/**
 * 获取历史委托
 * @param {数据} data 
 */
export function swap_hisorders(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_hisorders',data)
}

/**
 * 获取历史成交记录
 * @param {数据} data 
 */
export function swap_matchresults(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_matchresults',data)
}

/**
 * 查询用户账户和持仓信息
 * @param {数据} data 
 */
export function swap_account_position_info(data={}){
    data.contract_code = contract_code
    return POST('/linear-swap-api/v1/swap_account_position_info',data)
}

