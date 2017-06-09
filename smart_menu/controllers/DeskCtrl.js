/**
 * Created by luyan on 27/05/2017.
 */
var DeskModel = require('../models/DeskModel.js');

var currentDeskCateId;

/*展示已有桌位*/
exports.onShowDesks = function (req, res) {
	var deskCateId = req.query.deskCateId;
	currentDeskCateId = deskCateId;
	DeskModel.findAll(global.sql.desk,{deskCateId:deskCateId},function (results) {
		res.render("desk_list", {title: '桌位展示', results: results});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onShowNewDesk = function (req, res) {
	res.render("desk_new", {title: '添加桌位'});
};

exports.onSaveNewDesk = function (req, res) {
	var deskName = req.body.deskName;
	var deskCapacity = req.body.deskCapacity;
	var deskId = req.body.deskId;
	var desk = {
		deskName: deskName,
		deskCapacity: deskCapacity,
		deskStatue:0,
		deskCateId:currentDeskCateId,
		updateTime: global.date
	};

	if (deskId) {
		var updateDesk = {
			deskName: deskName,
			deskCapacity: deskCapacity,
			updateTime: global.date
		};
		DeskModel.update(global.sql.desk, {deskId:deskId}, updateDesk, function (result) {
			res.send({msg: '桌位更新成功', status: 0});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	} else {
		DeskModel.insert(global.sql.desk, desk, function (result) {
			res.send({msg: "桌位添加成功", status: 0});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}
};

exports.onRemoveDesk = function (req, res) {
	var deskId = req.query.deskId;
	DeskModel.remove(global.sql.desk, {deskId:deskId}, function (result) {
		res.send({msg: "桌位删除成功", status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onShowDeskDetail = function (req, res) {
	var deskId = req.query.deskId;
	DeskModel.findOne(global.sql.desk, {deskId:deskId}, function (result) {
		res.render("desk_detail", {title: '桌位详情', desk:result});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};