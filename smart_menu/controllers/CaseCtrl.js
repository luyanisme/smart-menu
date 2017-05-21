/**
 * Created by luyan on 1/30/17.
 */
var formidable = require('formidable'),
	fs = require('fs')

var CaseModel = require('../models/CaseModel.js');
var CaseTypeModel = require('../models/CaseTypeModel.js');
var CaseStandardModel = require('../models/CaseStandardModel.js');
var CasePropertyModel = require('../models/CasePropertyModel.js');

var randomID = require('../utils/randomIdUtil.js');
var fsmanager = require('../utils/fileManagerUtil.js');

exports.onSpecialCase = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	var condition = {
		where: {
			caseTypeId: caseTypeId
		}
	}
	CaseModel.findAll(global.sql.case, condition, function (result) {
		result.forEach(function (r) {
			r.caseStandardVals = JSON.parse(r.caseStandardVals);
			r.casePropertyVals = JSON.parse(r.casePropertyVals);
		})
		res.render("case_show_list", {title: '商品列表', caseTypeId: caseTypeId, results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

/*删除*/
exports.onRemoveCase = function (req, res) {
	var caseId = req.query.caseId;
	CaseModel.findOne(global.sql.case, caseId, function (result) {
		var path = global.uploadFloder + result.dataValues.caseImagePath;
		var caseTypeId = result.caseTypeId;
		CaseModel.remove(global.sql.case, caseId, function (result) {
			CaseTypeModel.findOne(global.sql.caseType, caseTypeId, function (result) {
				var caseNum = parseInt(result.caseNums) - 1;
				CaseTypeModel.update(global.sql.caseType, result.caseTypeId, {caseNums: caseNum}, function (result) {
					//将图片删除
					fsmanager.deleteFile(path, function () {
						res.send({msg: '删除成功', status: 0});
					})
				},function (err) {
					res.send({msg: err, status: 1});
				});
			},function (err) {
				res.send({msg: err, status: 1});
			})

		},function (err) {
			res.send({msg: err, status: 1});
		});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

/*上传*/
exports.onUpload = function (req, res) {
	var form = new formidable.IncomingForm();   //创建上传表单
	var imageName = '';
	form.encoding = 'utf-8';        //设置编辑
	form.uploadDir = global.uploadFloder;     //设置上传目录
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

			var avatarName = randomID.getUUID() + '.' + extName;
			imageName = avatarName;
			var newPath = form.uploadDir + avatarName;
			fs.renameSync(files[key].path, newPath);  //重命名
		}

		var caseName = fields.caseName;
		var price = fields.price;
		var hotId = fields.hotId;
		var caseTypeId = fields.caseTypeId;
		var standardVals = fields.standardVals;
		var propertyVals = fields.propertyVals;
		var caseScaling = fields.caseScaling;

		var Case;
		if (avatarName) {
			Case = {
				caseName: caseName,
				caseTypeId: caseTypeId,
				caseHot: hotId,
				casePrice: price,
				caseImagePath: avatarName,
				caseStandardVals: standardVals,
				casePropertyVals: propertyVals,
				caseScaling: caseScaling,
				updateTime: global.date
			};
		} else {
			Case = {
				caseName: caseName,
				caseTypeId: caseTypeId,
				caseHot: hotId,
				casePrice: price,
				caseStandardVals: standardVals,
				casePropertyVals: propertyVals,
				caseScaling: caseScaling,
				updateTime: global.date
			};
		}

		/*如果是修改商品信息*/
		if (fields.caseId) {
			if (Case.caseImagePath != null) {
				CaseModel.findOne(global.sql.case, fields.caseId, function (result) {
					//将图片删除
					var path = global.uploadFloder + result.dataValues.caseImagePath;
					fsmanager.deleteFile(path, function () {
						CaseModel.update(global.sql.case, fields.caseId, Case, function (result) {
							res.send({msg: '保存成功!', status: 0});
						});
					})
				},function (err) {
					res.send({msg: err, status: 1});
				})
			} else {
				CaseModel.update(global.sql.case, fields.caseId, Case, function (result) {
					res.send({msg: '保存成功!', status: 0});
				},function (err) {
					res.send({msg: err, status: 1});
				});
			}
		} else {
			CaseModel.insert(global.sql.case, Case, function (result) {
				CaseTypeModel.findOne(global.sql.caseType, caseTypeId, function (result) {
					var caseNum = parseInt(result.caseNums) + 1;
					CaseTypeModel.update(global.sql.caseType, result.caseTypeId, {caseNums: caseNum}, function (result) {
						res.send({msg: '保存成功!', status: 0});
					},function (err) {
						res.send({msg: err, status: 1});
					});
				},function (err) {
					res.send({msg: err, status: 1});
				})

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

/*显示商品详情*/
exports.onShowCaseDetail = function (req, res) {
	var caseId = req.query.caseId;
	CaseModel.findOne(global.sql.case, caseId, function (result) {
		result.caseStandardVals = JSON.parse(result.caseStandardVals);
		result.casePropertyVals = JSON.parse(result.casePropertyVals);
		res.render("case_detail", {title: '商品详情', result: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
}

/*添加新商品*/
exports.onShowNewCase = function (req, res) {
	var caseTypeId = req.query.caseTypeId;
	res.render("case_new", {title: '添加商品', caseTypeId: caseTypeId, imgName: ''});
};

/*商品规格*/
exports.onShowCaseStandard = function (req, res) {
	CaseStandardModel.findAll(global.sql.caseStandard, function (result) {
		result.forEach(function (result) {
			result.standardVals = JSON.parse(result.standardVals);
		})
		res.render("case_standard_list", {title: '商品规格', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*添加商品规格*/
exports.onShowCaseNewStandard = function (req, res) {
	res.render("case_new_standard", {title: '添加商品规格'});
};

/*规格详情*/
exports.onShowCaseDetailStandard = function (req, res) {
	var caseStandardId = req.query.caseStandardId;
	CaseStandardModel.findOne(global.sql.caseStandard, caseStandardId, function (result) {
		result.standardVals = JSON.parse(result.standardVals);
		res.render("case_detail_standard", {title: '规格详情', result: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*保存商品规格*/
exports.onSaveCaseStandard = function (req, res) {
	var caseStandard = {
		caseStandardName: req.body.standardName,
		caseStandardNums: req.body.caseStandardNums,
		standardVals: req.body.standardVals,
		caseStandardScaling: true,
		updateTime: global.date
	};
	if (req.body.caseStandardId) {
		CaseStandardModel.update(global.sql.caseStandard, req.body.caseStandardId, caseStandard, function (result) {
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	} else {
		CaseStandardModel.insert(global.sql.caseStandard, caseStandard, function (result) {
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	}

};

exports.onShowCaseStandardForm = function (req, res) {
	CaseStandardModel.findAll(global.sql.caseStandard, function (result) {
		result.forEach(function (r) {
			r.standardVals = JSON.parse(r.standardVals);
		})
		res.render("case_standard_form", {title: '添加规格', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onDeleteCaseStandard = function (req, res) {
	var caseStandardId = req.query.caseStandardId;
	CaseStandardModel.remove(global.sql.caseStandard, caseStandardId, function (result) {
		res.send({msg: '删除成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*商品属性*/
exports.onShowCaseProperty = function (req, res) {
	CasePropertyModel.findAll(global.sql.caseProperty, function (result) {
		result.forEach(function (result) {
			result.propertyVals = JSON.parse(result.propertyVals);
		})
		res.render("case_property_list", {title: '商品属性', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*添加商品属性*/
exports.onShowCaseNewProperty = function (req, res) {
	res.render("case_new_property", {title: '添加商品属性'});
};

/*属性详情*/
exports.onShowCaseDetailProperty = function (req, res) {
	var casePropertyId = req.query.casePropertyId;
	CasePropertyModel.findOne(global.sql.caseProperty, casePropertyId, function (result) {
		result.propertyVals = JSON.parse(result.propertyVals);
		res.render("case_detail_property", {title: '属性详情', result: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*保存商品属性*/
exports.onSaveCaseProperty = function (req, res) {
	var caseProperty = {
		casePropertyName: req.body.propertyName,
		casePropertyNums: req.body.casePropertyNums,
		propertyVals: req.body.propertyVals,
		casePropertyScaling: true,
		updateTime: global.date
	};
	if (req.body.casePropertyId) {
		CasePropertyModel.update(global.sql.caseProperty, req.body.casePropertyId, caseProperty, function (result) {
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	} else {
		CasePropertyModel.insert(global.sql.caseProperty, caseProperty, function (result) {
			res.send({msg: '保存成功!', status: 0});
		},function (err) {
			res.send({msg: err, status: 1});
		})
	}

};

exports.onShowCasePropertyForm = function (req, res) {
	CasePropertyModel.findAll(global.sql.caseProperty, function (result) {
		result.forEach(function (r) {
			r.propertyVals = JSON.parse(r.propertyVals);
		})
		res.render("case_property_form", {title: '添加属性', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

exports.onDeleteCaseProperty = function (req, res) {
	var casePropertyId = req.query.casePropertyId;
	CasePropertyModel.remove(global.sql.caseProperty, casePropertyId, function (result) {
		res.send({msg: '删除成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*是否上架*/
exports.onChangeCaseSaling = function (req, res) {
	var caseId = req.query.caseId;
	var caseScaling = req.query.caseScaling;

	var data = {
		caseScaling: caseScaling == "true" ? true : false,
	};

	CaseModel.update(global.sql.case, caseId, data, function (result) {
		res.send({msg: '修改成功!', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};


