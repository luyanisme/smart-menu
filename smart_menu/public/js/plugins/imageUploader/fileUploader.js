/**
 * Created by luyan on 29/06/2017.
 */
$('#imageFile').fileinput({
	language: 'zh', //设置语言
	allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],//接收的文件后缀,
	showUpload: false,
	showRemove: isAmending == true ? false : true
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
