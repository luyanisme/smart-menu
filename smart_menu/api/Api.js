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
	}).then(function (casecates) {
		for(var i=0;i<casecates.length;i++){
			for(var j=0;j<casecates[i].cases.length;j++){
				casecates[i].cases[j].caseStandardVals = JSON.parse(casecates[i].cases[j].caseStandardVals);
				casecates[i].cases[j].casePropertyVals = JSON.parse(casecates[i].cases[j].casePropertyVals);
			}
		}
		res.send({msg:'请求成功', statue:0,data:casecates});
	});
};

/*获取菜单列表*/
exports.getWeChatMenuList = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.caseType.hasMany(global.sql.case, {foreignKey: 'caseTypeId'});
	global.sql.caseType.findAll({
		where:{shopId:shopId},
		include: {model: global.sql.case}
	}).then(function (casecates) {
		for(var i=0;i<casecates.length;i++){
			for(var j=0;j<casecates[i].cases.length;j++){
				casecates[i].cases[j].dataValues.orderNum = 0;
				casecates[i].cases[j].dataValues.orderAllNum = 0;
				var standardVals = JSON.parse(casecates[i].cases[j].caseStandardVals);
				var propertyVals = JSON.parse(casecates[i].cases[j].casePropertyVals);
				casecates[i].cases[j].dataValues.standards = [];
				if (standardVals.length > 0){
					casecates[i].cases[j].dataValues.standards.push(standardVals);
				}
				if(propertyVals.length > 0){
					casecates[i].cases[j].dataValues.standards.push(propertyVals);
				}
			}
		}
		res.send({msg:'请求成功', statue:0,data:casecates});
	});
};

exports.postOrderedList = function (req, res) {
	var orderedItem = req.body;
	res.send({msg: "下单成功", status: 0, data:null});
}

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