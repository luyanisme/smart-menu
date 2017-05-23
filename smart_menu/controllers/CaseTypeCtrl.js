/**
 * Created by luyan on 2/16/17.
 */
var caseTypeModel = require('../models/CaseTypeModel.js');

exports.onShowCaseTypes = function (req, res) {
	var shopId = req.session.user.shopId;
	caseTypeModel.findAll(global.sql.caseType, {shopId:shopId},function (result) {
		res.render("case_type_list", {title: '商品分类', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onRemoveCaseType = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	caseTypeModel.remove(global.sql.caseType,caseTypeId,function(){
		res.send({msg: '删除成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onShowCaseTypesForm = function (req, res) {
	res.render("case_type_form", {title: '商品分类'});
};

exports.onShowCaseAmendTypesForm = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	caseTypeModel.findOne(global.sql.caseType,caseTypeId,function (result) {
		res.render("case_type_amend_form", {title: '商品分类修改',result:result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onAddCaseType = function(req, res) {
	var caseTypeName = req.query.caseTypeName;
	var caseTypeId = req.query.caseTypeId;
	var caseType = {
		caseTypeName:caseTypeName,
		caseNums:0,
		caseOnNums:0,
		caseOffNums:0,
		caseTypeSaling:true,
		shopId:req.session.user.shopId,
		updateTime: global.date
	};
	if (caseTypeId){
		caseTypeModel.update(global.sql.caseType,caseTypeId, caseType, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	} else {
		caseTypeModel.insert(global.sql.caseType, caseType, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	}

};
