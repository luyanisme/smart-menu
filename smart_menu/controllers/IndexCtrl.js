/**
 * Created by luyan on 1/29/17.
 */
var CaseTypeModel = require('../models/CaseTypeModel.js');
var DeskCateModel = require('../models/DeskCateModel.js');
var UserModel = require('../models/UserModel.js');
var EditionModel = require('../models/EditionModel.js');

exports.doLoad = function (req, res) {
	var shopId = req.session.user.shopId;
	if(req.session.user.authorityId == 2){
		doLoadV1(req, res);
	} else {
		CaseTypeModel.findAll(global.sql.caseType, {shopId:shopId, caseTypeSaling:true}, function (caseTypes) {
			DeskCateModel.findAll(global.sql.deskCate,{shopId:shopId},function (deskCates) {
				res.render("index", {title: '智慧菜单', caseTypes: caseTypes, deskCates:deskCates,user: req.session.user});
			},function (err) {
				res.send({msg: err, status: 1});
			})
		},function (err) {
			res.send({msg: err, status: 1});
		});
	}

};

function doLoadV1 (req, res) {
	UserModel.findAll(global.sql.user,{},function (users) {
		EditionModel.findAll(global.sql.edition,{},function (editions) {
			res.render("index_v1", {title: '账号添加',users: users,editions:editions});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

