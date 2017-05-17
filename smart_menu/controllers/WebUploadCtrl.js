/**
 * Created by luyan on 03/05/2017.
 */
/*添加新商品*/
exports.onShowWebUpload = function (req, res) {
	res.render("form_webuploader", {title: '文件上传'});
};