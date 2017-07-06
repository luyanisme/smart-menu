/**
 * Created by luyan on 28/06/2017.
 */
var EditionModel = require('../models/EditionModel.js');
var FuncModel = require('../models/FuncModel.js');
var ShopModel = require('../models/ShopModel.js');

exports.onShowEdtion = function (req, res) {
	var editionId = req.query.editionId;
	EditionModel.findOne(global.sql.edition, {editionId: editionId}, function (edition) {
		edition.editionModuleIds = JSON.parse(edition.editionModuleIds);
		FuncModel.findAll(global.sql.func,{funcId:edition.editionModuleIds},function (funcs) {
			res.render("edition_config", {title: edition.dataValues.editionName, edition: edition.toJSON(), funcs:funcs});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}, function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onAddModule = function (req, res) {
	FuncModel.findAll(global.sql.func, {}, function (funcs) {
		res.render('module_add_form', {title: '模块选择', funcs: funcs});
	}, function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onSaveEdition = function (req, res) {
	var editionId = req.body.editionId;
	var editionDesc = req.body.editionDesc;
	var editionModuleIds = req.body.editionModuleIds;
	var edition = {
		editionId: editionId,
		editionDesc: editionDesc,
		editionModuleIds: editionModuleIds
	};
	EditionModel.update(global.sql.edition, {editionId: editionId}, edition, function (result) {
		ShopModel.findAll(global.sql.shop, {}, function (shops) {
			var updateDatas = [];
			shops.forEach(function (shop) {
				if (shop.shopEditionId == editionId){
					shop.shopModuleIds = JSON.parse(shop.shopModuleIds);
					editionModuleIds = JSON.parse(editionModuleIds);
					if (editionModuleIds.length > shop.shopModuleIds.length) {
						var diffs = editionModuleIds.diff(shop.shopModuleIds);
						diffs.forEach(function (diff) {
							shop.shopModuleIds.push(diff);
						})
					}
					shop.shopModuleIds = JSON.stringify(shop.shopModuleIds);
					updateDatas.push(shop.dataValues);
				}
			})
			ShopModel.updateBulk(global.sql.shop,updateDatas,function (result) {
				res.send({msg: "保存成功", status: 0});
			}, function (err) {
				res.send({msg: err, status: 1});
			})

		}, function (err) {
			res.send({msg: err, status: 1});
		});
	}, function (err) {
		res.send({msg: err, status: 1});
	});
}

Array.prototype.diff = function (a) {
	return this.filter(function (i) {
		return isContain(a, i) == false;
	});
};

function isContain(moduleIds, id) {
	for (var i = 0; i < moduleIds.length; i++) {
		if (moduleIds[i] == id) {
			return true;
		}
	}
	return false;
}