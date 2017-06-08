/**
 * Created by luyan on 4/11/17.
 */

/****************************************Api of Http*************************************************/
/*获取菜单列表*/
exports.getMenuList = function (req, res) {

	// global.sql.case.belongsTo(global.sql.caseType, {foreignKey: 'caseTypeId'});
	var shopId = req.query.shopId;
	global.sql.caseType.hasMany(global.sql.case, {foreignKey: 'caseTypeId'});
	global.sql.caseType.findAll({
		where:{shopId:shopId},
		include: {model: global.sql.case}
	}).then(function (cases) {
		res.send(cases);
	});
};

/*获取消息列表，需要添加分页查询*/
exports.getNotices = function (req, res) {

}

/****************************************Api of Socket***********************************************/
/*插入消息*/
exports.insertNotice = function (notice, callBack, errBack) {
	notice.noticeIsDealed = false;
	notice.shopId = 1;
	global.sql.notice.create(notice).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}