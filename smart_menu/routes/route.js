/**
 * Created by luyan on 1/29/17.
 */
var express = require('express');
var router = express.Router();

/*view*/
var indexCtrl = require('../controllers/IndexCtrl.js');
var caseCtrl = require('../controllers/CaseCtrl.js');
var caseTypeCtrl = require('../controllers/CaseTypeCtrl.js');
var deskCateCtrl = require('../controllers/DeskCateCtrl.js');
var deskCtrl = require('../controllers/DeskCtrl.js');
var ordersCtrl = require('../controllers/OrdersCtrl.js');
var webUploadCtrl = require('../controllers/WebUploadCtrl.js');
var postCtrl = require('../controllers/PostCtrl.js');
var loginCtrl = require('../controllers/LoginCtrl.js');
var accountCtrl = require('../controllers/AccountCtrl.js');
var mobileCtrl = require('../controllers/MobileCtrl.js');

router.route('/addNewAccount').get(accountCtrl.onAddNewAccount).post(accountCtrl.onSaveAccount);/*添加账户*/
router.route('/accountDetail').get(accountCtrl.onShowDetailAccount)/*账户详情*/
router.route('/removeAccount').get(accountCtrl.onRemoveAccount)/*删除账户*/
router.route('/forbidAccount').get(accountCtrl.onForbidAccount)/*停用账户*/
router.route('/startUseAccount').get(accountCtrl.onStartUseAccount)/*启用账户*/

router.route('/login').get(loginCtrl.onShowLogin).post(loginCtrl.routeToView);/*登录*/
router.route('/logout').get(loginCtrl.onLogout);/*登出*/
router.route('/formWizard').get(accountCtrl.onShowFormWizard).post(accountCtrl.onSaveFormWizard)/*表单验证*/

router.route('/index').get(indexCtrl.doLoad);/*主页*/
router.route('/index_v1').get(indexCtrl.doLoadV1);/*账号管理界面*/
router.route('/caseType').get(caseTypeCtrl.onShowCaseTypes);/*商品分类*/
router.route('/caseTypeForm').get(caseTypeCtrl.onShowCaseTypesForm);/*商品分类*/
router.route('/caseTypeAmendForm').get(caseTypeCtrl.onShowCaseAmendTypesForm);/*商品分类*/
router.route('/removeCaseType').get(caseTypeCtrl.onRemoveCaseType);/*删除商品分类*/
router.route('/addCaseTypeForm').get(caseTypeCtrl.onAddCaseType);/*商品分类添加*/

router.route('/caseShowList').get(caseCtrl.onSpecialCase);/*展示商品*/
router.route('/caseNew').get(caseCtrl.onShowNewCase).post(caseCtrl.onUpload);/*添加新的商品*/
router.route('/caseShow').get(caseCtrl.onShowCaseInfo);/*展示商品信息*/
router.route('/caseDetail').get(caseCtrl.onShowCaseDetail);/*商品详情*/
router.route('/caseStandard').get(caseCtrl.onShowCaseStandard);/*展示商品规格*/
router.route('/caseNewStandard').get(caseCtrl.onShowCaseNewStandard).post(caseCtrl.onSaveCaseStandard);/*添加商品规格*/
router.route('/caseStandardForm').get(caseCtrl.onShowCaseStandardForm);/*添加商品规格表单*/
router.route('/caseDetailStandard').get(caseCtrl.onShowCaseDetailStandard);/*商品规格详情*/
router.route('/removeCaseStandard').get(caseCtrl.onDeleteCaseStandard);/*删除商品规格*/

router.route('/caseProperty').get(caseCtrl.onShowCaseProperty);/*展示商品属性*/
router.route('/caseNewProperty').get(caseCtrl.onShowCaseNewProperty).post(caseCtrl.onSaveCaseProperty);/*添加商品属性*/
router.route('/casePropertyForm').get(caseCtrl.onShowCasePropertyForm);/*添加商品属性表单*/
router.route('/caseDetailProperty').get(caseCtrl.onShowCaseDetailProperty);/*商品属性详情*/
router.route('/removeCaseProperty').get(caseCtrl.onDeleteCaseProperty);/*删除商品属性*/

router.route('/changeCaseSaling').get(caseCtrl.onChangeCaseSaling);/*修改商品上架*/
router.route('/changeCaseTypeSaling').get(caseTypeCtrl.onChangeCaseTypeSaling);/*修改商品分类上架*/

router.route('/removeCase').get(caseCtrl.onRemoveCase);/*删除商品*/
router.route('/webUpLoad').get(webUploadCtrl.onShowWebUpload);/*上传*/

router.route('/postMaterial').get(postCtrl.onShowPostMaterial);/*海报素材*/
router.route('/postNewMaterial').get(postCtrl.onShowNewPostMaterial).post(postCtrl.onUpload);/*海报素材*/
router.route('/postDetailMaterial').get(postCtrl.onShowDetailPostMaterial);/*海报素材*/
router.route('/removePostMaterial').get(postCtrl.onRemovePostMaterial);/*海报素材*/
router.route('/onUploadImage').post(postCtrl.onUploadImage);/*富文本编辑上传图片*/
router.route('/addPost').get(postCtrl.onAddPost);/*添加海报*/
router.route('/choosePostForm').get(postCtrl.onShowPostChooseForm);/*海报选择*/
router.route('/choosePost').get(postCtrl.onChoosePost);/*海报添加*/
router.route('/removePost').get(postCtrl.onRemovePost);/*移除海报*/

router.route('/deskCate').get(deskCateCtrl.onShowDeskCate);/*桌位分类*/
router.route('/deskCateForm').get(deskCateCtrl.onShowDeskCateForm);/*桌位分类添加*/
router.route('/deskCateAmendForm').get(deskCateCtrl.onShowDeskAmendCateForm);/*桌位分类修改*/
router.route('/removeDeskCate').get(deskCateCtrl.onRemoveDeskCate);/*删除桌位分类*/
router.route('/addDeskCateForm').get(deskCateCtrl.onAddDeskCate);/*桌位分类添加*/

router.route('/onShowDesks').get(deskCtrl.onShowDesks);/*桌位展示*/
router.route('/addNewDesk').get(deskCtrl.onShowNewDesk).post(deskCtrl.onSaveNewDesk);/*桌位添加*/
router.route('/detailDesk').get(deskCtrl.onShowDeskDetail);/*展示桌位详情*/

router.route('/showOrders').get(ordersCtrl.onShowOrderList);/*订单详情*/

router.route('/showMobiles').get(mobileCtrl.onShowMobileList);/*终端列表*/
router.route('/newMobile').get(mobileCtrl.onShowNewMobile).post(mobileCtrl.onSaveNewMobile);/*添加设备*/
router.route('/removeMobile').get(mobileCtrl.onRemoveMobile);/*添加设备*/
router.route('/detailMobile').get(mobileCtrl.onShowDetailMobile);/*展示设备详情*/

var Api = require('../api/Api.js');
var API = '/Api';
/********************************************移动端接口********************************************/
router.route(API+'/getMenu').get(Api.getMenuList);/*获取菜单*/
router.route(API+'/insertNotice').get(Api.insertNotice);/*插入新的消息*/
router.route(API+'/getNotices').get(Api.getNotices);/*获取消息列表*/
router.route(API+'/postOrderedList').post(Api.postOrderedList);/*获取已点商品*/

/********************************************微信小程序接口********************************************/
var WECHAT = '/Api/Wechat';
router.route(WECHAT+'/getMenu').get(Api.getWeChatMenuList);/*获取菜单*/

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8181 });

//广播
wss.broadcast = function broadcast(s,ws) {
	// console.log(ws);
	// debugger;
	wss.clients.forEach(function each(client) {
		// if (typeof client.user != "undefined") {
		if(s == 1){
			client.send(ws.name + ":" + ws.msg);
		}
		if(s == 0){
			client.send(ws + "退出聊天室");
		}
		// }
	});
};

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		if(message){
			// Api.insertNotice(JSON.parse(message),function (result) {
			//
			// }, function (err) {
			//
			// })
		}

		console.log('received: %s', JSON.stringify(message));
		wss.clients.forEach(function each(client) {
			/*判断当前客户端是否为本身*/
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	//ws.send('something');
});

module.exports = router;