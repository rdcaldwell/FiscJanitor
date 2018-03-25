/* eslint no-unused-vars: 0, no-else-return:0, no-param-reassign:0 */
const LOGGER = require('log4js').getLogger('jenkins');
const mongoose = require('mongoose');
const JENKINS = require('jenkins')({
  baseUrl: `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_API_TOKEN}@localhost:8080`,
  crumbIssuer: true,
});

const CLUSTER = mongoose.model('Cluster');

LOGGER.level = 'info';

const destroyByName = (name) => {
  LOGGER.info(`destroying ${name}`);
  JENKINS.job.build({
    name: 'Destroy_Cluster',
    parameters: {
      cluster: name,
    },
  }, (jenkinserr) => {
    if (jenkinserr) {
      LOGGER.error(jenkinserr);
      return false;
    } else {
      LOGGER.info(`${name} cluster destroyed using Jenkins`);
      CLUSTER.findOne({
        context: name,
      }, (clustererr, cluster) => {
        cluster.destroyed = true;
        cluster.save();
      });
      return true;
    }
  });
};

module.exports.destroyByName = destroyByName;

module.exports.destroy = (req, res) => {
  const isDestroyed = destroyByName(req.params.id);
  if (isDestroyed) res.json(`${req.params.id} cluster destroyed using Jenkins`);
};
