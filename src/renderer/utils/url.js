export var urlEncode = (param,idx, key, encode)=> {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      var one_is =idx<3?'?':'&';
      paramStr += one_is + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        idx++
        paramStr += urlEncode(param[i],idx, k, encode);
      }
    }
    return paramStr;
  };
export var compare = function (obj1, obj2) {
  var val1 = obj1.id;
  var val2 = obj2.id;
  if (val1 < val2) {
      return -1;
  } else if (val1 > val2) {
      return 1;
  } else {
      return 0;
  }            
} 