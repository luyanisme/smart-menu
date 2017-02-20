/**
 * Created by luyan on 2/16/17.
 */
var caseTypeModel = require('../models/CaseTypeModel.js');
var randomID = require('../utils/randomIdUtil.js');

exports.onShowCaseTypes = function (req, res) {
	caseTypeModel.findAll(global.sql.caseType, function (result) {
		res.render("case_type_list", {title: '菜品分类', results: result});
	});
};

exports.onRemoveCaseType = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	caseTypeModel.remove(global.sql.caseType,caseTypeId,function(){
		res.send({msg: '删除成功!', status: 0});
	});
};

exports.onShowCaseTypesForm = function (req, res) {
	res.render("case_type_form", {title: '菜品分类'});
};

exports.onAddCaseType = function(req, res) {
	var caseTypeName = req.query.caseTypeName;
	var caseType = {
		caseTypeId:randomID.getUUID(),
		caseTypeName:caseTypeName,
		caseNums:0,
		caseOnNums:0,
		caseOffNums:0,
		caseTypeSaling:true
	};
	caseTypeModel.insert(global.sql.caseType, caseType, function(){
		res.send({msg: '保存成功!', status: 0});
	});
};
