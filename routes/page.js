// routes/page.js

var mongoose = require('mongoose');
var config = require('../config');
var Q = require('q');
exports.get_url = '/page/:page_id';

exports.get = function(req, res, next) {
  var page_id = parseInt(req.params.page_id, 10);
  if (!page_id) {
    page_id = 0;
  }
  
  var Say = mongoose.model('Say');
  Say.find()
    .sort([['date', 'descending']])
    .skip(config.PAGE_MAX * page_id).limit(config.PAGE_MAX)
    .populate('user')
    .exec(function(err, says) {
      if (err !== null) {
        next(500);
      }
      else if (says.length === 0) {
        next();
      }
      else {
        Say.countObject()
          .then(function(count) {
            // resolve pager
            var pager_length = config.PAGE_MAX;
            var page_count = Math.ceil(count / pager_length);
            var min_index = page_id - pager_length > 0 ? page_id - pager_length: 0;
            var max_index = page_id + pager_length < page_count ? page_id + pager_length: page_count - 1;
            var user_id = req.user || null;
            Q.allSettled(says.map(function(say) { return say.renderMarkdown(user_id); }))
              .then(function(says_html) {
                res.render('page', {
                  logged_in: req.isAuthenticated(),
                  nickname: req.isAuthenticated() ? req.user.nickname : null,
                  says: says,
                  says_html: says_html.map(function(v) { return v.value; }),
                  title: process.env.MD_TITLE || 'Markdown Chat',
                  count: Math.ceil(page_count),
                  index: page_id,
                  min_index: min_index,
                  max_index: max_index,
                });
              })
              .fail(function(err) {
                next(err);
              });
          });
      }
    });
};
