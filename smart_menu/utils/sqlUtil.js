/**
 * Created by luyan on 1/18/17.
 */

'use strict'

var Sequelize = require('sequelize');
var caseModel = require('../models/CaseModel.js');
var caseTypeModel = require('../models/CaseTypeModel.js');
var caseStandardModel = require('../models/CaseStandardModel.js');
var casePropertyModel = require('../models/CasePropertyModel.js');
var postModel = require('../models/PostModel.js');
var userModel = require('../models/UserModel.js');
var editionModel = require('../models/EditionModel.js');
var authorityModel = require('../models/AuthorityModel.js');
var shopModel = require('../models/ShopModel.js');
var deskCateModel = require('../models/DeskCateModel.js');
var deskModel = require('../models/DeskModel.js');
var mobileModel = require('../models/MobileModel.js');
var noticeModel = require('../models/NoticeModel.js');
var orderModel = require('../models/OrderModel.js');
var orderedModel = require('../models/OrderedModel.js');
var funcModel = require('../models/FuncModel.js');
var funcDataModule = require('../models/FuncDataModuleModel.js');

var testModel = require('../models/TestModel.js');

var db = {
	sequelize : new Sequelize(
		'test', // 数据库名
		'admin',   // 用户名
		'',   // 用户密码
		// 'sm_db', // 数据库名
		// 'root',   // 用户名
		// 'ly1qaz@WSX3edc',   // 用户密码
		{
			'dialect': 'mysql',  // 数据库使用mysql
			'host': 'localhost', // 数据库服务器ip
			'port': 3306,        // 数据库服务器端口
			"timezone": "+08:00",
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

/*商品类型*/
db.caseType = caseTypeModel.onCreate(db.sequelize);

/*商品*/
db.case = caseModel.onCreate(db.sequelize);

/*商品规格*/
db.caseStandard = caseStandardModel.onCreate(db.sequelize);

/*商品属性*/
db.caseProperty = casePropertyModel.onCreate(db.sequelize);

/*商品海报*/
db.post = postModel.onCreate(db.sequelize);

/*用户*/
db.user = userModel.onCreate(db.sequelize);

/*版本*/
db.edition = editionModel.onCreate(db.sequelize);

/*权限*/
db.authority = authorityModel.onCreate(db.sequelize);

/*商店*/
db.shop = shopModel.onCreate(db.sequelize);

/*桌位分类*/
db.deskCate = deskCateModel.onCreate(db.sequelize);

/*桌位*/
db.desk = deskModel.onCreate(db.sequelize);

/*终端*/
db.mobile = mobileModel.onCreate(db.sequelize);

/*消息*/
db.notice = noticeModel.onCreate(db.sequelize);

/*订单*/
db.order = orderModel.onCreate(db.sequelize);

/*已订单*/
db.ordered = orderedModel.onCreate(db.sequelize);

/*功能模块*/
db.func = funcModel.onCreate(db.sequelize);

/*功能数据*/
db.funcDataModule = funcDataModule.onCreate(db.sequelize);

/*测试模块*/
db.test = testModel.onCreate(db.sequelize);

// db.sequelize.query("DROP event IF EXISTS e_delete_wxauth; CREATE EVENT e_delete_wxauth ON SCHEDULE EVERY 1 DAY STARTS '2000-01-01 00:00:00' DO DELETE FROM notice WHERE DATE < DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 30 MINUTE);");

module.exports = db;