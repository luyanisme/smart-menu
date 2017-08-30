/**
 * Created by luyan on 28/08/2017.
 */
//引入nodejs加密核心库
var crypto = require('crypto');
//加密公共密钥 32位

var config = require('../Config');

//编码设置
var clearEncoding = 'utf8';
//加密方式
var algorithm = 'aes-256-ecb';
//向量
var iv = "";
//加密类型 base64/hex...
var cipherEncoding = 'hex';

exports.encodeCipher = function(data){
	try{
		var cipher = crypto.createCipheriv(algorithm, config.AES_KEY, iv);
		var cipherChunks = [];
		cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
		cipherChunks.push(cipher.final(cipherEncoding));
		return cipherChunks.join('');
	}catch(e){
		return 10004;
	}
}

exports.decodeCipher = function(data){
	try{
		var cipherChunks = [data];
		var decipher = crypto.createDecipheriv(algorithm, config.AES_KEY, iv);
		var plainChunks = [];
		for (var i = 0;i < cipherChunks.length;i++) {
			plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
		}
		plainChunks.push(decipher.final(clearEncoding));
		return plainChunks.join(''); //转成对象，方便程序中使用
	}catch(e){
		return 10003;
	}
}
