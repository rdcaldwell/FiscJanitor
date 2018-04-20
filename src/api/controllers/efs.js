/* eslint no-param-reassign:0 */
const ASYNC = require('async');
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('EFS');
const UTILS = require('../config/utils');

LOGGER.level = 'info';

/* GET EFS instances */
module.exports.describe = (req, res) => {
  const efsData = [];
  ASYNC.forEachOf(UTILS.regions, (awsRegion, i, callback) => {
    const EFS = new AWS.EFS({
      apiVersion: '2015-02-01',
      region: awsRegion,
    });

    EFS.describeFileSystems({}, (err, data) => {
      if (err) LOGGER.error(err);
      else if (data.FileSystems.length) {
        ASYNC.forEachOf(data.FileSystems, (fileSystem, j, tagCallback) => {
          EFS.describeTags({
            FileSystemId: fileSystem.FileSystemId,
          }, (tagerr, tagdata) => {
            if (err) LOGGER.error(err);
            else if (tagdata !== null) {
              fileSystem.Tags = tagdata.Tags;
              efsData.push(fileSystem);
            }

            tagCallback();
          });
        }, () => {
          callback();
        });
      } else {
        callback();
      }
    });
  }, () => {
    if (efsData.length) res.json(efsData);
    else res.json('No efs data');
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const EFS = new AWS.EFS({
    apiVersion: '2015-02-01',
    region: req.query.region,
  });

  const params = {
    FileSystemId: req.query.id,
  };

  EFS.deleteFileSystem(params, (err) => {
    if (err) res.json(err);
    else {
      LOGGER.info(`${req.query.id} terminated`);
      res.json(`${req.query.id} terminated`);
    }
  });
};
