/**
 * Created by luyan on 1/30/17.
 */
var formidable = require('formidable'),
	fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = 'DATAS/'

var caseModel = require('../models/CaseModel.js');
var randomID = require('../utils/randomIdUtil.js');
var fsmanager = require('../utils/fileManagerUtil.js');

exports.onSpecialCase = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	var condition = {
		where:{
			caseType:caseTypeId
		}
	}
	caseModel.findAll(global.sql.case, condition, function (result) {
		res.render("case_show_list", {title: '特色菜', caseTypeId: caseTypeId, results: result});
	});
};

/*删除*/
exports.onRemoveCase = function (req, res) {
	var caseId = req.query.caseId;
	caseModel.findOne(global.sql.case, caseId, function(result){
		var path = AVATAR_UPLOAD_FOLDER + result.dataValues.caseImagePath;
		caseModel.remove(global.sql.case, caseId, function(result){
			//将图片删除
			fsmanager.deleteFile(path,function(){
				res.send({msg: '删除成功', status: 0});
			})
		});
	});
};

/*修改*/
exports.onShowAmendForm = function (req, res) {
	/*查找数据库*/
	var price = req.query.price;
	var caseName = req.query.case_name;
	var imgPath = req.query.imgPath;
	var hotId = req.query.hotId;
	var caseId = req.query.caseId;
	res.render("case_amend_form", {
		title: '修改信息',
		price: price,
		caseName: caseName,
		imgName: imgPath,
		hotId: hotId,
		caseId: caseId
	});
};

/*上传*/
exports.onUpload = function (req, res) {
	var form = new formidable.IncomingForm();   //创建上传表单
	var imageName = '';
	form.encoding = 'utf-8';        //设置编辑
	form.uploadDir = AVATAR_UPLOAD_FOLDER;     //设置上传目录
	form.keepExtensions = true;     //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

	form.parse(req, function (err, fields, files) {

		if (err) {
			res.send({msg: '上传失败', status: 1});
			res.locals.error = err;
			res.render('case_form', {title: '修改信息', price: '123', caseName: '红烧河豚'});
			return;
		}

		for (var key in files) {
			var extName = '';  //后缀名
			switch (files[key].type) {
				case 'image/pjpeg':
					extName = 'jpg';
					break;
				case 'image/jpeg':
					extName = 'jpg';
					break;
				case 'image/png':
					extName = 'png';
					break;
				case 'image/x-png':
					extName = 'png';
					break;
			}

			if (extName.length == 0) {
				res.locals.error = '只支持png和jpg格式图片';
				res.send({msg: '保存失败', status: 1});
				res.render('case_form', {title: '修改信息', price: '123', caseName: '红烧河豚'});
				return;
			}

			var avatarName = randomID.getUUID() + '.' + extName;
			imageName = avatarName;
			var newPath = form.uploadDir + avatarName;
			fs.renameSync(files[key].path, newPath);  //重命名
		}

		var caseName = fields.caseName;
		var price = fields.price;
		var hotId = fields.hotId;
		var caseTypeId = fields.caseTypeId;
		console.log('==='+caseTypeId);
		var Case;
		if(avatarName){
			Case = {
				caseId: fields.caseId == null ? randomID.getUUID() : fields.caseId,
				caseName: caseName,
				caseType: caseTypeId,
				caseHot: hotId,
				casePrice: price,
				caseImagePath: avatarName
			};
		} else {
			Case = {
				caseId: fields.caseId,
				caseName: caseName,
				caseType: caseTypeId,
				caseHot: hotId,
				casePrice: price
			};
		}

		/*如果是修改菜品信息*/
		if (fields.caseId) {
			if(Case.caseImagePath != null){
				caseModel.findOne(global.sql.case, fields.caseId, function(result){
					//将图片删除
					var path = AVATAR_UPLOAD_FOLDER + result.dataValues.caseImagePath;
					fsmanager.deleteFile(path,function(){
						caseModel.update(global.sql.case, fields.caseId, Case, function (result) {
							res.send({msg: '保存成功!', status: 0});
						});
					})
				})
			}
		} else {
			caseModel.insert(global.sql.case, Case, function (result) {
				res.send({msg: '保存成功!', status: 0});
			});
		}

	});

	//form.on('progress', function(bytesReceived, bytesExpected) {
	//	console.log(Math.round((bytesReceived / bytesExpected) * 100));
	//});

	//form.on('end', function () {
	//	res.locals.success = '上传成功';
	//	res.render('case_form', {title: '修改信息', price: '123', caseName: '红烧河豚', imgName: imageName});
	//});

};

/*展示菜色信息*/
exports.onShowCaseInfo = function (req, res) {
	/*查找数据库*/
	var price = req.query.price;
	var caseName = req.query.case_name;
	var imgPath = req.query.imgPath;
	var hot;
	switch (req.query.hotId) {
		case '0':
			hot = '暂无星评';
			break;
		case '1':
			hot = '1星好评';
			break;
		case '2':
			hot = '2星好评';
			break;
		case '3':
			hot = '3星好评';
			break;
		case '4':
			hot = '4星好评';
			break;
		case '5':
			hot = '5星好评';
			break;
	}
	res.render("case_show", {title: '修改信息', price: price, caseName: caseName, imgName: imgPath, hot: hot});
};

/*添加新菜品*/
exports.onShowNewCaseForm = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	res.render("case_new_form", {title: '添加菜品', caseTypeId: caseTypeId, imgName: ''});
};
