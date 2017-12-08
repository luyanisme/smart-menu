/**
 * Created by luyan on 2/16/17.
 */
var CaseTypeModel = require('../models/CaseTypeModel.js');
var ShopModel = require('../models/ShopModel.js');

exports.onShowCaseTypes = function (req, res) {
	var shopId = req.session.user.shopId;
	CaseTypeModel.findAll(global.sql.caseType, {shopId:shopId},function (result) {
		ShopModel.findOne(global.sql.shop,{shopId: shopId},function (shop) {
			shop.shopModuleIds = JSON.parse(shop.shopModuleIds);
			res.render("case_type_list", {title: '商品分类', results: result, shop: shop});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onRemoveCaseType = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	CaseTypeModel.remove(global.sql.caseType,{caseTypeId:caseTypeId},function(){
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
	CaseTypeModel.findOne(global.sql.caseType,{caseTypeId:caseTypeId},function (result) {
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
		caseTypeIsSpecial:false,
		shopId:req.session.user.shopId,
		updateTime: global.date
	};
	if (caseTypeId){
		CaseTypeModel.update(global.sql.caseType,{caseTypeId:caseTypeId}, caseType, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	} else {
		CaseTypeModel.insert(global.sql.caseType, caseType, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	}

};

/*是否上架*/
exports.onChangeCaseTypeSaling = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	var caseTypeSaling = req.query.caseTypeSaling;

	var data = {
		caseTypeSaling: caseTypeSaling == "true" ? true : false,
	};

	CaseTypeModel.update(global.sql.caseType, {caseTypeId: caseTypeId}, data, function (result) {
		res.send({msg: '修改成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};
