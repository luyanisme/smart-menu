/**
 * Created by luyan on 1/29/17.
 */
var express = require('express');
var router = express.Router();

var indexCtrl = require('../controllers/IndexCtrl.js');
var caseCtrl = require('../controllers/CaseCtrl.js');
var caseTypeCtrl = require('../controllers/CaseTypeCtrl.js');
var ordersCtrl = require('../controllers/OrdersCtrl.js');

router.route('/index').get(indexCtrl.doLoad);
router.route('/caseType').get(caseTypeCtrl.onShowCaseTypes);
router.route('/caseTypeForm').get(caseTypeCtrl.onShowCaseTypesForm);
router.route('/removeCaseType').get(caseTypeCtrl.onRemoveCaseType);
router.route('/addCaseTypeForm').get(caseTypeCtrl.onAddCaseType);
router.route('/caseShowList').get(caseCtrl.onSpecialCase);
router.route('/caseAmendForm').get(caseCtrl.onShowAmendForm).post(caseCtrl.onUpload);
router.route('/caseShow').get(caseCtrl.onShowCaseInfo);
router.route('/caseNewForm').get(caseCtrl.onShowNewCaseForm).post(caseCtrl.onUpload);
router.route('/removeCase').get(caseCtrl.onRemoveCase);

router.route('/showOrders').get(ordersCtrl.onShowOrderList);

module.exports = router;