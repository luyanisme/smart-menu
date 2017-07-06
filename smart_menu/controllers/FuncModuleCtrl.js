/**
 * Created by luyan on 28/06/2017.
 */
var FuncModel = require('../models/FuncModel.js');
var formidable = require('formidable'),
	fs = require('fs')
var randomID = require('../utils/randomIdUtil.js');
var fsmanager = require('../utils/fileManagerUtil.js');

exports.onShowFuncModule = function (req, res) {
	FuncModel.findAll(global.sql.func,{},function (funcs) {
		res.render("func_module", {title: '模块', funcs:funcs});
	},function (err) {
		res.send({msg: err, status: 1});
	})

}

exports.onAddFuncModule = function (req, res) {
	res.render("func_module_new", {title: '添加模块', func:null});
}

exports.onShowDetailFuncModule = function (req, res) {
	var funcId = req.query.funcId;
	FuncModel.findOne(global.sql.func,{funcId:funcId},function (func) {
		res.render("func_module_new", {title: '添加模块', func:func});
	},function (err) {
		res.send({msg: err, status: 1});
	})

}

/*上传*/
exports.onUpload = function (req, res) {
	var form = new formidable.IncomingForm();   //创建上传表单
	var imageName = '';
	form.encoding = 'utf-8';        //设置编辑
	form.uploadDir = global.iconFloder ;     //设置上传目录
	form.keepExtensions = true;     //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

	form.parse(req, function (err, fields, files) {

		if (err) {
			res.send({msg: '上传失败', status: 1});
			res.locals.error = err;
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
				return;
			}

			var iconName = randomID.getUUID() + '.' + extName;
			imageName = iconName;
			var newPath = form.uploadDir + iconName;
			fs.renameSync(files[key].path, newPath);  //重命名
		}

		var moduleName = fields.moduleName;
		var moduleDesc = fields.moduleDesc;
		var moduleField = fields.moduleField;
		var isOperating = (fields.operateSelect == "false" ? false : true);

		var func;
		if (iconName) {
			func = {
				funcName: moduleName,
				funcDesc: moduleDesc,
				funcIconPath: iconName,
				funcField: moduleField,
				isOperating: isOperating,
				isUsing:true,
				updateTime: global.date
			};
		} else {
			func = {
				funcName: moduleName,
				funcDesc: moduleDesc,
				funcField: moduleField,
				isOperating: isOperating,
				isUsing:true,
				updateTime: global.date
			};
		}

		/*如果是修改模块信息*/
		if (fields.funcId) {
			if (func.funcIconPath != null) {
				FuncModel.findOne(global.sql.func, {funcId:fields.funcId}, function (result) {
					//将图片删除
					var path = global.iconFloder + result.dataValues.funcIconPath;
					fsmanager.deleteFile(path, function () {
						FuncModel.update(global.sql.func, {funcId:fields.funcId}, func, function (result) {
							res.send({msg: '保存成功!', status: 0});
						},function (err) {
							res.send({msg: err, status: 1});
						});
					})
				},function (err) {
					res.send({msg: err, status: 1});
				})
			} else {
				FuncModel.update(global.sql.func, {funcId:fields.funcId}, func, function (result) {
					res.send({msg: '保存成功!', status: 0});
				},function (err) {
					res.send({msg: err, status: 1});
				});
			}
		} else {
			FuncModel.insert(global.sql.func, func, function (result) {
				res.send({msg: '保存成功!', status: 0});
			},function (err) {
				res.send({msg: err, status: 1});
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

/*删除模块*/
exports.onRemoveFuncModule = function (req, res) {
	var funcId = req.query.funcId;
	FuncModel.findOne(global.sql.func, {funcId:funcId}, function (result) {
		var path = global.iconFloder + result.dataValues.funcIconPath;
		FuncModel.remove(global.sql.func, {funcId:funcId}, function (result) {
			//将图片删除
			fsmanager.deleteFile(path, function () {
				res.send({msg: '删除成功', status: 0});
			})
		},function (err) {
			res.send({msg: err, status: 1});
		});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};
