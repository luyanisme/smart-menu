/**
 * Created by luyan on 1/18/17.
 */

'use strict'

var Sequelize = require('sequelize');
var caseModel = require('../models/CaseModel.js');
//var adminModel = require('../models/AdminModel.js');

var db = {
	sequelize : new Sequelize(
		'test', // 数据库名
		'admin',   // 用户名
		'',   // 用户密码
		{
			'dialect': 'mysql',  // 数据库使用mysql
			'host': 'localhost', // 数据库服务器ip
			'port': 3306,        // 数据库服务器端口
			'define': {
				// 字段以下划线（_）来分割（默认是驼峰命名风格）
				'underscored': true
			},
			dialectOptions: {
				charset: "utf8",
				collate: "utf8_general_ci",
				supportBigNumbers: true,
				bigNumberStrings: true
			}
		}
	)
}

db.case = caseModel.onCreate(db.sequelize);
//db.admin = adminModel.onCreate(db.sequelize);

module.exports = db;