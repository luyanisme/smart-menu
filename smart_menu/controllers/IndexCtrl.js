/**
 * Created by luyan on 1/29/17.
 */
var caseTypeModel = require('../models/CaseTypeModel.js');

exports.doLoad = function (req, res) {
	caseTypeModel.findAll(global.sql.caseType, function (result) {
		res.render("index", {title: '智慧菜单', results: result});
	});
	//res.render("index", {title: '智慧菜单'});
};

