import CryptoJS from 'crypto-js/crypto-js'
import {dateFormat} from './date'
const Store = require('electron-store');
const store = new Store();
export function createSignature(baseUrl,api,method){
	var setting = store.get('setting')
	var date = new Date();
	// date.setHours(date.getHours()+8)
	var nowDate = dateFormat(date,'YYYY-mm-ddTHH:MM:SS')
    var as=method+"\n"+baseUrl+"\n"+api+"\nAccessKeyId="+setting.accessKey+"&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp="+encodeURIComponent(nowDate)
	let hash = CryptoJS.HmacSHA256(as, setting.secretKey);
	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
	console.log(hashInBase64)
	var data={
		AccessKeyId:setting.accessKey,
		SignatureMethod:'HmacSHA256',
		SignatureVersion:2,
		Timestamp:nowDate,
		Signature:hashInBase64,
	}
	return data;
}