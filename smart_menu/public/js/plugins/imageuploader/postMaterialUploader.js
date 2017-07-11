/**
 * Created by luyan on 15/05/2017.
 */
$('#imageFile').fileinput({
	language: 'zh', //设置语言
	allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],//接收的文件后缀,
	showUpload: false,
	showRemove: false
});

$(function () {
	var docObj = document.getElementById("imageFile");
	var imgObjPreview = document.getElementById("fileImage");
	var uploadBg = document.getElementById("upload");
	$('#imageFile').on('change', function (event) {
		if (docObj.files && docObj.files[0]) {
			imgObjPreview.style.display = 'block';
			if (uploadBg) {
				uploadBg.style.display = 'none';
			}
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
		} else {
			docObj.select();
			var imgSrc = document.selection.createRange().text;
			var localImagId = document.getElementById("fileImage");
//                localImagId.style.width = "300px";
//                localImagId.style.height = "120px";

			try {
				localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			} catch (e) {
				return false;
			}
			imgObjPreview.style.display = 'none';
			document.selection.empty();
		}
		return true;
	});
	$('#imageFile').on('fileselect', function (event, numFiles, label) {
		console.log("fileselect");
	});

	$('#imageFile').on('fileclear', function (event, key) {
		uploadBg.style.display = 'block';
		imgObjPreview.style.display = 'none';
	});

	$('#imageFile').on('fileuploaded', function (event, data, previewId, index) {
		alert('');
	});
})

String.prototype.format = function (args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof (args) == "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		}
		else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

$(function () {
	$('#save').on('click', function () {
		var imageFileVal = $('#imageFile').val(),
			errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ';

		$("#errorTip,#alt_warning").remove();

		var data = new FormData();

		if (imageFileVal.length == 0 && !$("#fileImage").attr("src")) {
			$("#container").prepend(errorTip.format('请选择要上传的文件'));
			window.scroll(0, 0);
			return false;
		}
		if (imageFileVal.length != 0) {
			var extName = imageFileVal.substring(imageFileVal.lastIndexOf('.'), imageFileVal.length).toLowerCase();

			if (extName != '.png' && extName != '.jpg' && extName != '.jpeg') {
				$("#container").prepend(errorTip.format('只支持png和jpg格式图片'));
				window.scroll(0, 0);
				return false;
			}
		}

		var postName = $('#postName').val();
		var startDate = $('#start').val();
		var endDate = $('#end').val();
		var aHtml = $('.summernote').summernote('code');

		// aHtml = aHtml.replace(/\n/ig, '').replace(/\s+/g, "");

		if (postName == '') {
			layer.msg('您还未输入海报名称', {time: 1000}, function () {
				//parent.location.reload(); // 父页面刷新
			});
			return;
		}

		if (startDate == '') {
			layer.msg('请输入开始时间', {time: 1000}, function () {
				//parent.location.reload(); // 父页面刷新
			});
			return;
		}

		if (endDate == '') {
			layer.msg('请输入结束时间', {time: 1000}, function () {
				//parent.location.reload(); // 父页面刷新
			});
			return;
		}

		if (aHtml == '') {
			layer.msg('您还未输入海报描述', {time: 1000}, function () {
				//parent.location.reload(); // 父页面刷新
			});
			return;
		}

		if (regex(postName) == false) {
			layer.msg('商品名称含非法字符', {time: 1000}, function () {
				//parent.location.reload(); // 父页面刷新
			});
			return;
		}

		//上传图片文件
		var files = $("#imageFile")[0].files;

		if (files) {
			data.append("file", files[0]);
		}

		if (isAmending == true) {
			data.append('postId', postId);
		}
		data.append('postName', postName);
		data.append('aHtml', aHtml);
		data.append('startDate', startDate);
		data.append('endDate', endDate);
		$.ajax({
			url: 'postNewMaterial',
			type: 'POST',
			data: data,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (data) {
				if (data.status == 0) {
					layer.msg(data.msg, {time: 1000, icon: 1}, function () {
						self.location = document.referrer;
						/*返回上一级并且刷新*/
					});
				}
			},
			error: function (err) {
				console.log(err);
				if (err.status == 1) {
					layer.msg(err.msg, {time: 1000, icon: 1}, function () {
					});
				}

			}
		})

		return true;
	})
});