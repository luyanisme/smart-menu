/**
 * Created by luyan on 1/29/17.
 */

var caseModel = require('../models/CaseModel.js');

exports.doLoad = function (req, res) {
	res.render("index", {title: '智慧菜单'});
};

