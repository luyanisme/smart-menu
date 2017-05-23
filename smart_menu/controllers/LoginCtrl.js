/**
 * Created by luyan on 17/05/2017.
 */

var UserModel = require('../models/UserModel.js');

exports.onShowLogin = function (req, res) {
	res.render("login", {title: '登录'});
};

exports.routeToView = function (req, res) {
	var userName = req.body.username;
	var password = req.body.password;

	UserModel.findOne(global.sql.user, {userName: userName},function (result) {
		if (result == null){
			res.send({msg: '用户名不存在', status: 1});
			result;
		}
		if (password == result.dataValues.password){
			req.session.user = result;
			res.send({msg: '登录成功', status: 0, user: result});
		} else {
			res.send({msg: '密码或用户名错误', status: 1});
		}
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onLogout = function (req, res) {
	req.session.destroy();
	res.send({msg: '注销成功', status: 0});
};
