/**
 * Created by luyan on 23/05/2017.
 */

var MobileModel = require('../models/MobileModel.js');

exports.onShowMobileList = function (req, res) {
	var shopId = req.session.user.shopId;
	MobileModel.findAll(global.sql.mobile, {shopId: shopId}, function (result) {
		res.render("mobile_list", {title: '终端设备', results: result});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onShowNewMobile = function (req, res) {
	res.render("mobile_new", {title: '添加设备'});
};

exports.onSaveNewMobile = function (req, res) {
	var shopId = req.session.user.shopId;
	var mobilePhoneNum = req.body.phoneNum;
	var mobileName = req.body.mobileName;
	var password = req.body.password;

	var moblie = {
		mobilePhoneNum: mobilePhoneNum,
		mobileName: mobileName,
		password: password,
		shopId: shopId
	};

	MobileModel.insert(global.sql.mobile, moblie, function (result) {
		res.send({msg: "设备添加成功", status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onShowDetailMobile = function (req, res) {
	var mobileId = req.query.mobileId;
	MobileModel.findOne(global.sql.mobile, {mobileId: mobileId}, function (result) {
		res.render("mobile_detail", {title: '设备详情', result: result});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onRemoveMobile = function (req, res) {
	var mobileId = req.query.mobileId;

	MobileModel.remove(global.sql.mobile, {mobileId: mobileId}, function (result) {
		res.send({msg: "设备删除成功", status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};