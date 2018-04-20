/* eslint no-restricted-syntax:0 */
const ROUTER = require('express').Router();
const AUTH_CONTROLLER = require('../controllers/auth');
const JANITOR_CONTROLLER = require('../controllers/janitor');
const JENKINS_CONTROLLER = require('../controllers/jenkins');
const EC2_CONTROLLER = require('../controllers/ec2');
const EFS_CONTROLLER = require('../controllers/efs');
const RDS_CONTROLLER = require('../controllers/rds');
const PRICE_CONTROLLER = require('../controllers/price');
const CLUSTER_CONTROLLER = require('../controllers/cluster');
const ANALYTICS_CONTROLLER = require('../controllers/analytics');
const JOB_CONTROLLER = require('../controllers/job');
const AUTH = require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

/* Authentication Controller */
ROUTER.post('/auth/register', AUTH_CONTROLLER.register);
ROUTER.post('/auth/login', AUTH_CONTROLLER.login);
ROUTER.get('/auth/profile', AUTH, AUTH_CONTROLLER.profileRead);

/* Validation Controller */
ROUTER.get('/auth/username/:id', AUTH_CONTROLLER.validateUsername);
ROUTER.get('/auth/email/:id', AUTH_CONTROLLER.validateEmail);

/* Janitor Controller */
ROUTER.post('/janitor/run', JANITOR_CONTROLLER.run);
ROUTER.get('/janitor/destroy/:id', JANITOR_CONTROLLER.destroyById);
ROUTER.get('/janitor/running', JANITOR_CONTROLLER.isJanitorRunningRoute);
ROUTER.get('/janitors', JANITOR_CONTROLLER.getJanitors);

/* Job Controller */
ROUTER.get('/job/cancel/:id', JOB_CONTROLLER.cancelJob);

/* Cluster Controller */
ROUTER.get('/clusters', CLUSTER_CONTROLLER.getClusters);
ROUTER.get('/cluster/monitor/remove/:id', CLUSTER_CONTROLLER.removeClusterMonitor);
ROUTER.get('/cluster/monitor/add/:id', CLUSTER_CONTROLLER.addClusterMonitor);
ROUTER.get('/cluster', EC2_CONTROLLER.getContextById);
ROUTER.get('/cluster/names', EC2_CONTROLLER.getClusterNames);

/* EC2 Controller */
ROUTER.get('/ec2/describe', EC2_CONTROLLER.describe);
ROUTER.get('/ec2/terminate', EC2_CONTROLLER.terminateById);

/* EFS Controller */
ROUTER.get('/efs/describe', EFS_CONTROLLER.describe);
ROUTER.get('/efs/terminate', EFS_CONTROLLER.terminateById);

/* RDS Controller */
ROUTER.get('/rds/describe', RDS_CONTROLLER.describe);
ROUTER.get('/rds/terminate', RDS_CONTROLLER.terminateById);

/* Jenkins Controller */
ROUTER.get('/jenkins/destroy/:id', JENKINS_CONTROLLER.destroy);

/* Analytics Controller */
ROUTER.get('/analyze', ANALYTICS_CONTROLLER.analyzeById);

/* Price Controller */
ROUTER.post('/price/ec2', PRICE_CONTROLLER.getEc2Price);
ROUTER.post('/price/rds', PRICE_CONTROLLER.getRdsPrice);

module.exports = ROUTER;
