/**
 * Created by luyan on 2/20/17.
 */
exports.onShowOrderList = function(req, res){
	res.render("orders", {title: '订单管理'});
}