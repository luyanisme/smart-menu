/**
 * Created by luyan on 15/05/2017.
 */
var PostModel = require('../models/PostModel.js');
var formidable = require('formidable'),
	fs = require('fs')

var randomID = require('../utils/randomIdUtil.js');
var fsmanager = require('../utils/fileManagerUtil.js');

var config = require('../Config.js');

exports.onShowPostMaterial = function (req, res) {
	var shopId = req.session.user.shopId;
	PostModel.findAll(global.sql.post, {shopId:shopId},function (result) {
		res.render("post_material_list", {title: '海报素材', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
}

exports.onShowNewPostMaterial = function (req, res) {
	res.render("post_material_new", {title: '海报添加'});
}

exports.onShowDetailPostMaterial = function (req, res) {
	var postId = req.query.postId;
	PostModel.findOne(global.sql.post, {postId:postId}, function (result) {
		res.render("post_material_detail", {title: '海报详情', result: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
}

/*上传*/
exports.onUpload = function (req, res) {
	var shopId = req.session.user.shopId;
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

		var postName = fields.postName;
		var aHtml = fields.aHtml;
		var startDate = fields.startDate;
		var endDate = fields.endDate;

		var post;
		if (avatarName) {
			post = {
				postName: postName,
				postDesc: aHtml,
				postImagePath: avatarName,
				postStartDate: startDate,
				postEndDate: endDate,
				shopId:shopId,
				updateTime: global.date
			};
		} else {
			post = {
				postName: postName,
				postDesc: aHtml,
				postStartDate: startDate,
				postEndDate: endDate,
				shopId:shopId,
				updateTime: global.date
			};
		}

		/*如果是修改海报信息*/
		if (fields.postId) {
			if (post.caseImagePath != null) {
				PostModel.findOne(global.sql.post, {postId:fields.postId}, function (result) {
					//将图片删除
					var path = global.uploadFloder + result.dataValues.caseImagePath;
					fsmanager.deleteFile(path, function () {
						PostModel.update(global.sql.post, {postId:fields.postId}, post, function (result) {
							res.send({msg: '保存成功!', status: 0});
						},function (err) {
							res.send({msg: err, status: 1});
						});
					})
				},function (err) {
					res.send({msg: err, status: 1});
				})
			} else {
				PostModel.update(global.sql.post, {postId:fields.postId}, post, function (result) {
					res.send({msg: '保存成功!', status: 0});
				},function (err) {
					res.send({msg: err, status: 1});
				});
			}
		} else {
			PostModel.insert(global.sql.post, post, function (result) {
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

/*上传*/
exports.onUploadImage = function (req, res) {
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

			res.send({msg: '图片上传成功!', status: 0, url: config.severIP +''+avatarName});
		}

	});

};

/*删除海报素材*/
exports.onRemovePostMaterial = function (req, res) {
	var postId = req.query.postId;
	PostModel.findOne(global.sql.post, {postId:postId}, function (result) {
		var path = global.uploadFloder + result.dataValues.postImagePath;
		PostModel.remove(global.sql.post, {postId:postId}, function (result) {
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

/*添加海报*/
exports.onAddPost = function (req, res) {
	PostModel.findAll(global.sql.post,{postIsChoosed: true},function (result) {
		res.render('post_add', {title: '海报添加', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	})
};

/*添加海报页面*/
exports.onShowPostChooseForm = function (req, res) {
	var shopId = req.session.user.shopId;
	PostModel.findAll(global.sql.post, {shopId:shopId},function (result) {
		res.render('post_choose_form', {title: '海报选择', results: result});
	},function (err) {
		res.send({msg: err, status: 1});
	});
};

/*添加海报*/
exports.onChoosePost = function (req, res) {
	var postId = req.query.postId;
	PostModel.findOne(global.sql.post, {postId:postId}, function (result) {
		if (result.dataValues.postIsChoosed == true){
			res.send({msg:'"'+result.dataValues.postName + '"已添加，请重新选择', status: 1});
		} else {
			var post = {
				postIsChoosed: true
			}
			PostModel.update(global.sql.post, {postId:postId}, post, function (result) {
				res.send({msg: '添加成功', status: 0});
			},function (err) {
				res.send({msg: err, status: 1});
			});
		}
	},function (err) {
		res.send({msg: err, status: 1});
	});

};

/*删除海报*/
exports.onRemovePost = function (req, res) {
	var postId = req.query.postId;
	var post = {
		postIsChoosed: false
	}
	PostModel.update(global.sql.post, postId, post, function (result) {
		res.send({msg: '移除成功', status: 0});
	},function (err) {
		res.send({msg: err, status: 1});
	});

};

