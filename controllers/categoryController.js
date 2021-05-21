exports.index = (req, res, next) => {
  res.render('index', { title: 'Test' });
};

// Category items list
exports.categoryItems = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// Create
exports.createGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.createPost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// Update
exports.updateGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.updatePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// Delete
exports.deleteGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.deletePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
