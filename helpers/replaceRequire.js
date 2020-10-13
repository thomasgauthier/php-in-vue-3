module.exports = function (_ref) {
    var t = _ref.types;
  
    return {
      visitor: {
        Identifier: function Identifier(path, state) {
          if (path.node.name == 'require') {
            if (!path.scope.hasOwnBinding("require")) {
              var leftArgs = path.parentPath && path.parentPath.node && path.parentPath.node.callee && path.parentPath.node.callee.arguments || {};
  
              if (leftArgs.length && leftArgs[0].value == "require") {
                path.replaceWithSourceString('__webpack_require__');
              }
            }
          }
        }
      }
    };
  };