/**
 * Created by luyan on 1/29/17.
 */
var CaseTypeModel = require('../models/CaseTypeModel.js');
var DeskCateModel = require('../models/DeskCateModel.js');
var UserModel = require('../models/UserModel.js');

exports.doLoad = function (req, res) {
	var shopId = req.session.user.shopId;
	CaseTypeModel.findAll(global.sql.caseType, {shopId:shopId, caseTypeSaling:true}, function (caseTypes) {
		DeskCateModel.findAll(global.sql.deskCate,{shopId:shopId},function (deskCates) {
			res.render("index", {title: '智慧菜单', caseTypes: caseTypes, deskCates:deskCates,user: req.session.user});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.doLoadV1 = function (req, res) {
	UserModel.findAll(global.sql.user,{},function (result) {
		res.render("index_v1", {title: '账号添加',results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

