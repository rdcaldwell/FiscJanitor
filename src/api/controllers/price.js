/* eslint no-param-reassign:0 */
const Ec2Price = require('../models/ec2_prices');
const RdsPrice = require('../models/rds_prices');

const getRegion = (region) => {
  if (region.startsWith('us')) {
    region = 'US';
  } else {
    region = 'IN';
  }
  return region;
};

module.exports.getEc2Price = (req, res) => {
  const region = getRegion(req.body.region);
  Ec2Price.Model.findOne({
    Region: region,
    Type: req.body.type,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};

module.exports.getRdsPrice = (req, res) => {
  const region = getRegion(req.body.region);

  RdsPrice.Model.findOne({
    Region: region,
    Type: req.body.type,
    DB: req.body.DB,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};
