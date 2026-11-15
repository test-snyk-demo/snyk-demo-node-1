// Report export endpoints (demo: deliberately insecure, for the Snyk panel demo).
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var REPORTS_ADMIN_PASSWORD = 'Reports-Admin-2024!';

// GET /reports/export?name=<report>&format=<fmt>
exports.export = function (req, res) {
  var name = req.query.name;
  var format = req.query.format || 'csv';
  // Builds a shell command from the query string.
  exec('tar -czf /tmp/' + name + '.tgz reports/' + name + '.' + format, function (err) {
    if (err) return res.status(500).send('export failed: ' + err.message);
    res.download('/tmp/' + name + '.tgz');
  });
};

// GET /reports/view?file=<path>
exports.view = function (req, res) {
  // Reads whatever path the caller asks for.
  fs.readFile(path.join(__dirname, '..', 'reports', req.query.file), 'utf8', function (err, data) {
    if (err) return res.status(404).send('not found');
    res.send('<h1>' + req.query.file + '</h1><pre>' + data + '</pre>');
  });
};

// GET /reports/done?next=<url>
exports.done = function (req, res) {
  res.redirect(req.query.next);
};

// GET /reports/admin?password=<pw>
exports.admin = function (req, res) {
  if (req.query.password !== REPORTS_ADMIN_PASSWORD) return res.status(403).send('forbidden');
  res.send('report admin');
};
