/**
 * Created by luyan on 28/06/2017.
 */
var EditionModel = require('../models/EditionModel.js');

exports.onShowEdtion = function (req, res) {
	var editionId = req.query.editionId;
	EditionModel.findOne(global.sql.edition,{editionId:editionId},function (edition) {
		res.render("edition_config", {title: edition.dataValues.editionName,edition:edition});
	},function (err) {
		res.send({msg: err, status: 1});
	});
}