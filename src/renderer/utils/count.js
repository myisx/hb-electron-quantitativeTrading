
/**
 * 得到下单的位置
 * @param {源数据}} source 
 * @param {要插入的目标数据} target 
 */
export function getInsertIndex(source,target){
    var indexs = []
    for(var j = 0;j<target.length;j++){
        indexs.push(-1)
        for(var i = 0;i<source.length;i++){
            if(target[j].id>source[i].id){
                indexs[j] = i
            }
        }
    }
    for(var s = 0;s<indexs.length;s++){
        if(indexs[s]!=-1){
            source[indexs[s]] = target[s]
        }
    }
    return indexs
}
/**
 * 数组对象排序
 * @param {参数名} property 
 * @param {是否升序} desc 
 */
export function compare(property,desc) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if(desc==true){
            // 升序排列
            return value1 - value2;
        }else{
            // 降序排列
            return value2 - value1;
        }
    }
}