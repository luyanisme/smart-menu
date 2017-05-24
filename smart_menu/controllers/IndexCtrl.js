/**
 * Created by luyan on 1/29/17.
 */
var caseTypeModel = require('../models/CaseTypeModel.js');
var userModel = require('../models/UserModel.js');

exports.doLoad = function (req, res) {
	var shopId = req.session.user.shopId;
	caseTypeModel.findAll(global.sql.caseType, {shopId:shopId, caseTypeSaling:true}, function (result) {
		res.render("index", {title: '智慧菜单', results: result, user: req.session.user});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.doLoadV1 = function (req, res) {
	userModel.findAll(global.sql.user,{},function (result) {
		res.render("index_v1", {title: '账号添加',results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

