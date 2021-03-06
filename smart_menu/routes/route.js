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
var editionCtrl = require('../controllers/EditionCtrl.js');
var mobileCtrl = require('../controllers/MobileCtrl.js');
var funcModuleCtrl = require('../controllers/FuncModuleCtrl.js');
var shopCtrl = require('../controllers/ShopCtrl.js');
var settingCtrl = require('../controllers/SettingCtrl.js');

router.route('/addNewAccount').get(accountCtrl.onAddNewAccount).post(accountCtrl.onSaveAccount);/*添加账户*/
router.route('/accountDetail').get(accountCtrl.onShowDetailAccount)/*账户详情*/
router.route('/removeAccount').get(accountCtrl.onRemoveAccount)/*删除账户*/
router.route('/forbidAccount').get(accountCtrl.onForbidAccount)/*停用账户*/
router.route('/startUseAccount').get(accountCtrl.onStartUseAccount)/*启用账户*/

router.route('/shopDetail').get(shopCtrl.onShowShopDetail).post(shopCtrl.onSaveShopInfo)/*展示店铺详情*/
router.route('/shopFuncModules').get(shopCtrl.onShowModuleList)/*展示店铺功能*/
router.route('/onStopOrStartModule').get(shopCtrl.onStopOrStartModule)/*停用启用模块功能*/

router.route('/onShowEdition').get(editionCtrl.onShowEdtion).post(editionCtrl.onSaveEdition)/*启用账户*/
router.route('/addModuleForm').get(editionCtrl.onAddModule)/*添加新模块*/

router.route('/login').get(loginCtrl.onShowLogin).post(loginCtrl.routeToView);/*登录*/
router.route('/logout').get(loginCtrl.onLogout);/*登出*/
router.route('/formWizard').get(accountCtrl.onShowFormWizard).post(accountCtrl.onSaveFormWizard)/*表单验证*/

router.route('/index').get(indexCtrl.doLoad);/*主页*/
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
router.route('/updatePostOrder').get(postCtrl.onUpdatePostOrder);/*更新海报顺序*/

router.route('/deskCate').get(deskCateCtrl.onShowDeskCate);/*桌位分类*/
router.route('/deskCateForm').get(deskCateCtrl.onShowDeskCateForm);/*桌位分类添加*/
router.route('/deskCateAmendForm').get(deskCateCtrl.onShowDeskAmendCateForm);/*桌位分类修改*/
router.route('/removeDeskCate').get(deskCateCtrl.onRemoveDeskCate);/*删除桌位分类*/
router.route('/addDeskCateForm').get(deskCateCtrl.onAddDeskCate);/*桌位分类添加*/

router.route('/onShowDesks').get(deskCtrl.onShowDesks);/*桌位展示*/
router.route('/addNewDesk').get(deskCtrl.onShowNewDesk).post(deskCtrl.onSaveNewDesk);/*桌位添加*/
router.route('/detailDesk').get(deskCtrl.onShowDeskDetail);/*展示桌位详情*/
router.route('/removeDesk').get(deskCtrl.onRemoveDesk);/*删除桌位*/

router.route('/showOrders').get(ordersCtrl.onShowOrderList);/*订单详情*/

router.route('/showMobiles').get(mobileCtrl.onShowMobileList);/*终端列表*/
router.route('/newMobile').get(mobileCtrl.onShowNewMobile).post(mobileCtrl.onSaveNewMobile);/*添加设备*/
router.route('/removeMobile').get(mobileCtrl.onRemoveMobile);/*添加设备*/
router.route('/detailMobile').get(mobileCtrl.onShowDetailMobile);/*展示设备详情*/

router.route('/showFuncModule').get(funcModuleCtrl.onShowFuncModule);/*展示模块列表*/
router.route('/addFuncModule').get(funcModuleCtrl.onAddFuncModule).post(funcModuleCtrl.onUpload);/*添加新模块*/
router.route('/showDetailModule').get(funcModuleCtrl.onShowDetailFuncModule).post(funcModuleCtrl.onUpload);/*添加新模块*/
router.route('/removeModule').get(funcModuleCtrl.onRemoveFuncModule);/*添加新模块*/
router.route('/funcDataList').get(funcModuleCtrl.onShowFuncDataList);/*添加新模块*/

router.route('/onRouteToView').get(funcModuleCtrl.onRouteToView);/*添加新模块*/

/********************************************模块页面的跳转********************************************/


var Api = require('../api/Api.js');
var API = '/Api';
/********************************************移动端接口********************************************/
router.route(API+'/getMenu').get(Api.getMenuList);/*获取菜单*/
router.route(API+'/insertNotice').get(Api.insertNotice);/*插入新的消息*/
router.route(API+'/getNotices').get(Api.getNotices);/*获取消息列表*/
router.route(API+'/clearNotices').get(Api.clearNotices);/*清空消息列表*/
router.route(API+'/getOrders').get(Api.getOrders);/*获取订单列表*/
router.route(API+'/clearOrders').get(Api.clearOrders);/*清空订单列表*/
router.route(API+'/getNowdayOrders').get(Api.getNowdayOrders);/*pad端获取今日的所有订单*/
router.route(API+'/postOrderedList').post(Api.postOrderedList);/*获取已点商品*/
router.route(API+'/changeDeskStatue').get(Api.changeDeskStatue);/*改变桌位状态*/
router.route(API+'/getDesk').get(Api.getDesk);
router.route(API+'/getOrdered').get(Api.getOrderedByAndroid);/*获取订单*/
router.route(API+'/getAllOrdered').get(Api.getAllOrderedByDate);/*获取所有订单*/
router.route(API+'/login').post(Api.login);/*登录*/
router.route(API+'/onChangeNoticeNeedConfirm').get(settingCtrl.onChangeNoticeNeedConfirm);/*是否确认订单按钮*/

/********************************************微信小程序接口********************************************/
var WECHAT = '/Api/Weixin';
router.route(WECHAT+'/getMenu').get(Api.getWeChatMenuList);/*获取菜单*/
router.route(WECHAT+'/getMainData').get(Api.getMainData);/*获取主页*/
router.route(WECHAT+'/getShopInfo').get(Api.getShopInfo);/*获取店铺信息*/
router.route(WECHAT+'/getOrdered').get(Api.getOrdered);/*获取订单*/
router.route(WECHAT+'/getSpecialCases').get(Api.getSpecialCases);/*获取特色菜*/
router.route(WECHAT+'/payAll').get(Api.payALL);/*小程序支付接口*/
router.route(WECHAT+'/paySuccess').get(Api.paySuccess);/*小程序支付接口*/

module.exports = router;