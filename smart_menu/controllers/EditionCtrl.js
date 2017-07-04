/**
 * Created by luyan on 28/06/2017.
 */
var EditionModel = require('../models/EditionModel.js');
var FuncModel = require('../models/FuncModel.js');

exports.onShowEdtion = function (req, res) {
	var editionId = req.query.editionId;
	EditionModel.findOne(global.sql.edition,{editionId:editionId},function (edition) {
		edition.editionModule = JSON.parse(edition.editionModule);
		res.render("edition_config", {title: edition.dataValues.editionName,edition:edition});
	},function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onAddModule = function (req, res) {
	FuncModel.findAll(global.sql.func,{},function (funcs) {
		res.render('module_add_form',{title: '模块选择', funcs:funcs});
	},function (err) {
		res.send({msg: err, status: 1});
	});
}

exports.onSaveEdition = function (req, res) {
	var editionId = req.body.editionId;
	var editionDesc = req.body.editionDesc;
	var editionModule = req.body.editionModule;
	var edition = {
		editionId: editionId,
		editionDesc: editionDesc,
		editionModule: editionModule
	};
	EditionModel.update(global.sql.edition,{editionId:editionId},edition,function (result) {
		res.send({msg: "保存成功", status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	});
}