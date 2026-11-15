// Report endpoints.
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var validator = require('validator');

var REPORTS_DIR = path.resolve(__dirname, '..', 'reports');

// GET /reports/export?name=<report>
// Fixed command injection: no shell (execFile with an argument list) and an allow-listed name.
exports.export = function (req, res) {
  var name = String(req.query.name || '');
  if (!/^[A-Za-z0-9_-]+$/.test(name)) return res.status(400).send('bad report name');
  execFile('tar', ['-czf', '/tmp/report.tgz', path.join('reports', name)], function (err) {
    if (err) return res.status(500).send('export failed');
    res.send('export started');
  });
};

// GET /reports/view?file=<name>
// Fixed path traversal: resolve the path and refuse anything outside reports/.
exports.view = function (req, res) {
  var file = path.resolve(REPORTS_DIR, String(req.query.file || ''));
  if (!file.startsWith(REPORTS_DIR + path.sep)) return res.status(400).send('bad path');
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) return res.status(404).send('not found');
    res.type('text/plain').send(data);
  });
};

// GET /reports/search?q=<text>
// Fixed cross-site scripting: escape user input before it goes into HTML.
exports.search = function (req, res) {
  res.send('<h1>Results for ' + validator.escape(String(req.query.q || '')) + '</h1>');
};
