/**
 * Created by luyan on 12/01/2018.
 */
var UserModel = require('../models/UserModel.js');
exports.onChangeNoticeNeedConfirm = function (req, res) {
	var userId = req.query.userId;
	var changeNoticeNeedConfirm = req.query.changeNoticeNeedConfirm;
	var user = {
		isNoticeNeedConfirm: changeNoticeNeedConfirm
	};

	UserModel.update(global.sql.user, {userId: userId}, user, function (result) {
		res.send({msg: '设置成功!', status: 0});
	}, function (err) {
		res.send({msg: err, status: 1,data:[]});
	});
}