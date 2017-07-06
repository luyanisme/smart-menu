/**
 * Created by luyan on 05/07/2017.
 */
var ShopModel = require('../models/ShopModel.js');
var FuncModel = require('../models/FuncModel.js');

exports.onShowShopDetail = function (req, res) {
	var shopId = req.query.shopId;
	ShopModel.findOne(global.sql.shop, {shopId: shopId}, function (shop) {
		shop.shopModuleIds = JSON.parse(shop.shopModuleIds);
		var funcIds = [];
		shop.shopModuleIds.forEach(function (func) {
			funcIds.push(func.funcId);
		});
		FuncModel.findAll(global.sql.func, {funcId: funcIds}, function (funcs) {
			res.render("shop_detail", {title: '店铺详情', shop: shop, funcs: funcs});
		}, function (err) {
			res.send({msg: err, status: 1});
		})

	}, function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onSaveShopInfo = function (req, res) {
	var shopId = req.body.shopId;
	var shopName = req.body.shopName;
	var shopAddress = req.body.shopAddress;
	var shopPhoneNum = req.body.shopPhoneNum;
	var shopModuleIds = req.body.shopModuleIds;

	var shop = {
		shopName: shopName,
		shopAddress: shopAddress,
		shopPhoneNum: shopPhoneNum,
		shopModuleIds: shopModuleIds
	}

	ShopModel.update(global.sql.shop, {shopId: shopId}, shop, function (shop) {
		res.send({msg: '保存成功', status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onShowModuleList = function (req, res) {
	var shopId = req.session.user.shopId;
	ShopModel.findOne(global.sql.shop, {shopId: shopId}, function (shop) {
		shop.shopModuleIds = JSON.parse(shop.shopModuleIds);
		var funcIds = [];
		var usings = [];
		shop.shopModuleIds.forEach(function (func) {
			funcIds.push(func.funcId);
			usings.push(func.isUsing);
		});
		FuncModel.findAll(global.sql.func, {funcId: funcIds}, function (funcs) {
			funcs.forEach(function (func, index) {
				func.isWorking = usings[index];
			})
			res.render("func_module_list", {title: '功能模块', shop: shop.toJSON(), funcs: funcs});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}, function (err) {
		res.send({msg: err, status: 1});
	})
}

exports.onStopOrStartModule = function (req, res) {
	var funcId = req.query.funcId;
	var shopId = req.session.user.shopId;
	ShopModel.findOne(global.sql.shop, {shopId: shopId}, function (shop) {
		shop.shopModuleIds = JSON.parse(shop.shopModuleIds);
		shop.shopModuleIds.forEach(function (func) {
			if (func.funcId == funcId) {
				if (func.isUsing == true) {
					func.isUsing = false;
				} else {
					func.isUsing = true;
				}
			}
		})
		shop.shopModuleIds = JSON.stringify(shop.shopModuleIds);
		ShopModel.update(global.sql.shop, {shopId: shopId}, {shopModuleIds:shop.shopModuleIds}, function (result) {
			res.send({msg: '修改成功', status: 0});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}, function (err) {
		res.send({msg: err, status: 1});
	})
}
