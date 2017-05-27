/**
 * Created by luyan on 27/05/2017.
 */
var DeskCateModel = require('../models/DeskCateModel.js');

exports.onShowDeskCate = function (req, res) {
	var shopId = req.session.user.shopId;
	DeskCateModel.findAll(global.sql.deskCate, {shopId:shopId},function (result) {
		res.render("desk_cate_list", {title: '桌位分类', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onRemoveDeskCate = function (req, res) {
	var deskCateId = req.query.deskCateId;
	DeskCateModel.remove(global.sql.deskCate,{deskCateId:deskCateId},function(){
		res.send({msg: '删除成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onShowDeskCateForm = function (req, res) {
	res.render("desk_cate_form", {title: '商品分类'});
};

exports.onShowDeskAmendCateForm = function (req, res) {
	var deskCateId = req.query.deskCateId;
	DeskCateModel.findOne(global.sql.deskCate,{deskCateId:deskCateId},function (result) {
		res.render("desk_cate_amend_form", {title: '商品分类修改',result:result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onAddDeskCate = function(req, res) {
	var deskCateName = req.query.deskCateName;
	var deskCateId = req.query.deskCateId;
	var deskCate = {
		deskCateName:deskCateName,
		deskNum:0,
		deskUsingNum:0,
		deskRemainNum:0,
		shopId:req.session.user.shopId,
		updateTime: global.date
	};
	if (deskCateId){
		DeskCateModel.update(global.sql.deskCate,{deskCateId:deskCateId}, deskCate, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	} else {
		DeskCateModel.insert(global.sql.deskCate, deskCate, function(){
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		});
	}

};