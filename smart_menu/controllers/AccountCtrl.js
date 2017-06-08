/**
 * Created by luyan on 17/05/2017.
 */
var UserModel = require('../models/UserModel.js');
var AuthorityModel = require('../models/AuthorityModel.js');
var EditionModel = require('../models/EditionModel.js');
var ShopModel = require('../models/ShopModel.js');
var DeskCateModel = require('../models/DeskCateModel.js');

exports.onAddNewAccount = function (req, res) {
	AuthorityModel.findAll(global.sql.authority, {}, function (authorities) {
		EditionModel.findAll(global.sql.edition, {}, function (editions) {
			res.render("account_new", {title: '添加账户', authorities: authorities, editions: editions});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}, function (err) {
		res.send({msg: err, status: 1});
	});
};

exports.onShowDetailAccount = function (req, res) {
	var userId = req.query.userId;
	UserModel.findOne(global.sql.user, {userId: userId}, function (User) {
		AuthorityModel.findAll(global.sql.authority, {}, function (authorities) {
			EditionModel.findAll(global.sql.edition, {}, function (editions) {
				res.render("account_detail", {title: '账户详情', authorities: authorities, editions: editions,User: User});
			}, function (err) {
				res.send({msg: err, status: 1});
			})
		}, function (err) {
			res.send({msg: err, status: 1});
		});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onRemoveAccount = function (req, res) {
	var userId = req.query.userId;
	UserModel.remove(global.sql.user, {userId:userId},function (result) {
		res.send({msg: '账户删除成功', status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onForbidAccount = function (req, res) {
	var userId = req.query.userId;
	UserModel.update(global.sql.user, {userId:userId},{isUsed:false},function (result) {
		res.send({msg: '账户停用成功', status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onStartUseAccount = function (req, res) {
	var userId = req.query.userId;
	UserModel.update(global.sql.user, {userId:userId},{isUsed:true},function (result) {
		res.send({msg: '账户启用成功', status: 0});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onSaveAccount = function (req, res) {
	var userName = req.body.userName;
	var password = req.body.password;
	var phoneNum = req.body.phoneNum;
	var authorityId = req.body.authorityId;
	var authority = req.body.authority;
	var editionId = req.body.editionId;
	var edition = req.body.edition;
	var userId = req.body.userId;

	var user = {
		userName: userName,
		phoneNum: phoneNum,
		password: password,
		authorityId: authorityId,
		authority: authority,
		editionId:editionId,
		edition:edition,
		updateTime: global.date
	}
	if (userId) {
		UserModel.update(global.sql.user, {userId:userId}, user, function (result) {
			res.send({msg: '账户更新成功', status: 0});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	} else {
		UserModel.insert(global.sql.user, user, function (result) {
			res.send({msg: '账户添加成功', status: 0});
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}

};

/*展示表单验证*/
exports.onShowFormWizard = function (req, res) {
	var userId = req.query.userId;
	UserModel.findOne(global.sql.user, {userId: userId}, function (result) {
		res.render("form_wizard", {title: '信息完善', result: result});
	}, function (err) {
		res.send({msg: err, status: 1});
	})
};

/*保存表单验证*/
exports.onSaveFormWizard = function (req, res) {

	var userId = req.body.userId;
	var password = req.body.password;
	var realName = req.body.realName;
	var phoneNum = req.body.phoneNum;
	var identity = req.body.identity;

	var email = req.body.email;
	var shopName = req.body.shopName;
	var shopAddress = req.body.shopAddress;
	var shopPhoneNum = req.body.shopPhoneNum;

	var user = {
		phoneNum:phoneNum,
		password:password,
		realName:realName,
		email:email,
		identify:identity,
		updateTime:global.date
	};

	var shop = {
		shopName:shopName,
		shopAddress: shopAddress,
		shopPhoneNum: shopPhoneNum,
	}

	var deskCate1 = {
		deskCateName:'大厅',
		deskNum:0,
		deskUsingNum:0,
		deskRemainNum:0,
		updateTime: global.date
	};

	var deskCate2 = {
		deskCateName:'包厢',
		deskNum:0,
		deskUsingNum:0,
		deskRemainNum:0,
		updateTime: global.date
	};

	ShopModel.insert(global.sql.shop,shop,function (result) {
		user.shopId = result.dataValues.shopId;
		req.session.user = user;
		deskCate1.shopId = result.dataValues.shopId;
		deskCate2.shopId = result.dataValues.shopId;
		UserModel.update(global.sql.user, {userId: userId}, user, function (result) {
			DeskCateModel.inserts(global.sql.deskCate,[deskCate1,deskCate2],function (result) {
				res.send({msg: "保存成功", status: 0});
			},function (err) {
				res.send({msg: err, status: 1});
			})
		}, function (err) {
			res.send({msg: err, status: 1});
		})
	}, function (err) {
		res.send({msg: err, status: 1});
	})

};