// Report endpoints (demo: deliberately insecure, for the Snyk panel demo).
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

// 1. Command injection: GET /reports/export?name=<report>
exports.export = function (req, res) {
  exec('tar -czf /tmp/report.tgz reports/' + req.query.name, function (err) {
    if (err) return res.status(500).send('export failed');
    res.send('export started');
  });
};

// 2. Path traversal: GET /reports/view?file=<path>
exports.view = function (req, res) {
  fs.readFile(path.join(__dirname, '..', 'reports', req.query.file), 'utf8', function (err, data) {
    if (err) return res.status(404).send('not found');
    res.type('text/plain').send(data);
  });
};

// 3. Cross-site scripting: GET /reports/search?q=<text>
exports.search = function (req, res) {
  res.send('<h1>Results for ' + req.query.q + '</h1>');
};
