/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function newSourceFile(fileName, contents) {
    return ts.createSourceFile(fileName, contents, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
}
exports.newSourceFile = newSourceFile;
function forEachComment(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    var fullText = sourceFile.text;
    return forEachToken(node, function (token) {
        if (token.kind !== ts.SyntaxKind.JsxText) {
            ts.forEachLeadingCommentRange(fullText, token.pos === 0 ? (ts.getShebang(fullText) || '').length : token.pos, commentCallback);
        }
        return ts.forEachTrailingCommentRange(fullText, token.end, commentCallback);
    }, sourceFile);
    function commentCallback(pos, end, kind) {
        cb(fullText, { pos: pos, end: end, kind: kind });
    }
}
exports.forEachComment = forEachComment;
function forEachToken(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    return (function iterate(child) {
        if (isTokenKind(child.kind)) {
            return cb(child);
        }
        if (child.kind !== ts.SyntaxKind.JSDocComment) {
            return child.getChildren(sourceFile).forEach(iterate);
        }
    })(node);
}
exports.forEachToken = forEachToken;
function isTokenKind(kind) {
    return kind >= ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken;
}
exports.isTokenKind = isTokenKind;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ts_parser_1 = __webpack_require__(2);
var ts_helpers_1 = __webpack_require__(0);
var add_import_1 = __webpack_require__(3);
var tsParser = null;
var HANDLERS = {
    parse: function (payload) {
        if (!tsParser) {
            tsParser = new ts_parser_1.TsParser();
        }
        return tsParser.parse(payload.path, payload.contents);
    },
    addImport: function (payload) {
        var insertChange = add_import_1.addImport(payload);
        return {
            file: payload.toFile.fullPath,
            position: insertChange.position,
            toInsert: insertChange.toInsert
        };
    },
    isInString: function (payload) {
        return {
            isInString: ts.isInString(ts_helpers_1.newSourceFile('', payload.contents), payload.offset)
        };
    },
    transpile: function (contents) {
        return ts.transpileModule(contents, {
            compilerOptions: {
                experimentalDecorators: true,
                module: ts.ModuleKind.CommonJS
            }
        }).outputText;
    }
};
function handleMessage(e) {
    var _a = e.data, id = _a[0], data = _a[1];
    if (!HANDLERS[data.type]) {
        console.warn("There is no handler for \"" + data.type + "\" type message");
    }
    var result = HANDLERS[data.type](data.payload);
    self.postMessage([id, result]);
}
self.addEventListener('message', handleMessage);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ts_helpers_1 = __webpack_require__(0);
importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/3.0.3/typescript.min.js');
var TsParser = (function () {
    function TsParser() {
    }
    TsParser.prototype.walk = function (sourceFile, info, key) {
        var visit = function (node) {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                var classDeclaration = node;
                info.classes.push({ name: classDeclaration.name.text, from: classDeclaration.getStart(), to: classDeclaration.getEnd() });
                classDeclaration.members
                    .filter(function (x) { return x.kind === ts.SyntaxKind.MethodDeclaration; })
                    .forEach(function (x) {
                    var text = x.name.getText();
                    var decoratorInfo = getDecoratorInfoByTsNode(sourceFile, x.name, text, 'Method');
                    info.decorators.push(decoratorInfo);
                });
            }
            node.getChildren().forEach(function (childNode) { return visit(childNode); });
            var text = node.getText();
            var cssClassName = ts.SyntaxKind[node.kind];
            switch (node.kind) {
                case ts.SyntaxKind.SyntaxList:
                case ts.SyntaxKind.SourceFile:
                case ts.SyntaxKind.PropertyAssignment:
                case ts.SyntaxKind.BinaryExpression:
                case ts.SyntaxKind.VariableDeclarationList:
                case ts.SyntaxKind.ExpressionStatement:
                case ts.SyntaxKind.VariableDeclaration:
                case ts.SyntaxKind.ElementAccessExpression:
                case ts.SyntaxKind.ReturnStatement:
                case ts.SyntaxKind.MethodDeclaration:
                    return;
                case ts.SyntaxKind.StringLiteral:
                case ts.SyntaxKind.FirstTemplateToken:
                    var stringLiteral = node;
                    if (stringLiteral.parent && stringLiteral.parent.name && stringLiteral.parent.name.text === 'template') {
                        if (stringLiteral.parent.parent && stringLiteral.parent.parent.parent &&
                            stringLiteral.parent.parent.parent.expression &&
                            stringLiteral.parent.parent.parent.expression.text === 'Component' &&
                            stringLiteral.parent.parent.parent.parent.parent) {
                            info.templatePositions[key].push({ start: node.pos, end: node.end, class: stringLiteral.parent.parent.parent.parent.parent.name.text + '_Template' });
                            return;
                        }
                    }
                    break;
                case ts.SyntaxKind.NewExpression:
                    var newExpression = node;
                    node = newExpression.expression;
                    text = node.getText();
                    break;
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propertyAccessExpression = node;
                    node = propertyAccessExpression.name;
                    text = node.getText();
                    break;
                case ts.SyntaxKind.CallExpression:
                    var callExpression = node;
                    node = callExpression.expression.name || callExpression.expression;
                    text = node.getText();
                    break;
                case ts.SyntaxKind.ImportDeclaration:
                    var importDeclaration = node;
                    var importClause = importDeclaration.importClause;
                    if (!importClause) {
                        break;
                    }
                    var bindings = importClause.namedBindings;
                    if (bindings) {
                        switch (bindings.kind) {
                            case ts.SyntaxKind.NamedImports:
                                for (var _i = 0, _a = bindings.elements; _i < _a.length; _i++) {
                                    var binding = _a[_i];
                                    info.imports[key].push(binding.propertyName ? binding.propertyName.text : binding.name.text);
                                }
                                break;
                            case ts.SyntaxKind.NamespaceImport:
                                break;
                        }
                    }
                    break;
                case ts.SyntaxKind.Identifier:
                    switch (text) {
                        case 'console':
                            cssClassName = 'ConsoleKeyword';
                            break;
                        case 'undefined':
                            cssClassName = 'UndefinedKeyword';
                            break;
                    }
            }
            var decoratorInfo = getDecoratorInfoByTsNode(sourceFile, node, text, cssClassName);
            info.decorators.push(decoratorInfo);
        };
        visit(sourceFile);
    };
    TsParser.prototype.parse = function (key, contents) {
        var result = { decorators: [], imports: {}, classes: [], templatePositions: {} };
        result.imports[key] = [];
        result.templatePositions[key] = [];
        var sourceFile = ts_helpers_1.newSourceFile(key, contents);
        this.walk(sourceFile, result, key);
        ts_helpers_1.forEachComment(sourceFile, function (text, node) {
            var start = sourceFile.getLineAndCharacterOfPosition(node.pos);
            var end = sourceFile.getLineAndCharacterOfPosition(node.end);
            var decoratorInfo = {
                range: {
                    startLineNumber: start.line + 1,
                    startColumn: start.character + 1,
                    endLineNumber: end.line + 1,
                    endColumn: end.character + 1,
                },
                options: {
                    inlineClassName: 'mtk7'
                }
            };
            result.decorators.push(decoratorInfo);
        });
        return result;
    };
    return TsParser;
}());
exports.TsParser = TsParser;
function getDecoratorInfoByTsNode(sourceFile, node, text, cssClassName) {
    var lineAndCharacter = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    var line = lineAndCharacter.line + 1;
    var startColumn = lineAndCharacter.character + 1;
    return {
        range: {
            startLineNumber: line,
            startColumn: startColumn,
            endLineNumber: line,
            endColumn: startColumn + text.length
        },
        options: {
            inlineClassName: cssClassName
        }
    };
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ts_helpers_1 = __webpack_require__(0);
function addImport(payload) {
    var source = ts_helpers_1.newSourceFile(payload.toFile.fullPath, payload.toFile.contents);
    var importPath = payload.type === 'global' ? payload.fromFile : getRelativePath(payload.toFile.fullPath, payload.fromFile).replace('.ts', '');
    var imported = isImported(source, payload.name, importPath);
    if (!imported) {
        return insertImport(source, payload.fromFile, payload.name, importPath);
    }
    return null;
}
exports.addImport = addImport;
function insertImport(source, fileToEdit, symbolName, fileName) {
    var rootNode = source;
    var allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
    var relevantImports = allImports.filter(function (node) {
        var importFiles = node.getChildren()
            .filter(function (child) { return child.kind === ts.SyntaxKind.StringLiteral; })
            .map(function (n) { return n.text; });
        return importFiles.filter(function (file) { return file === fileName; }).length === 1;
    });
    if (relevantImports.length > 0) {
        var importsAsterisk_1 = false;
        var imports_1 = [];
        relevantImports.forEach(function (n) {
            Array.prototype.push.apply(imports_1, findNodes(n, ts.SyntaxKind.Identifier));
            if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk_1 = true;
            }
        });
        if (importsAsterisk_1) {
            return;
        }
        var importTextNodes = imports_1.filter(function (n) { return n.text === symbolName; });
        if (importTextNodes.length === 0) {
            var fallbackPos = findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();
            return insertAfterLastOccurrence(imports_1, ", " + symbolName, fileToEdit, fallbackPos);
        }
        return;
    }
    var insertAtBeginning = allImports.length === 0;
    var separator = insertAtBeginning ? '' : ';\n';
    var toInsert = separator + "import { " + symbolName + " }" +
        (" from '" + fileName + "'" + (insertAtBeginning ? ';\n' : ''));
    return insertAfterLastOccurrence(allImports, toInsert, fileToEdit, 0, ts.SyntaxKind.StringLiteral);
}
function insertAfterLastOccurrence(nodes, toInsert, file, fallbackPos, syntaxKind) {
    var lastItem = nodes.sort(nodesByPosition).pop();
    if (syntaxKind) {
        lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
    }
    if (!lastItem && fallbackPos === undefined) {
        throw new Error("tried to insert " + toInsert + " as first occurence with no fallback position");
    }
    var position = lastItem ? lastItem.getEnd() : fallbackPos;
    return { file: file, position: position, toInsert: toInsert };
}
function isImported(source, classifiedName, importPath) {
    var allNodes = getSourceNodes(source);
    var matchingNodes = allNodes
        .filter(function (node) { return node.kind === ts.SyntaxKind.ImportDeclaration; })
        .filter(function (imp) { return imp.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral; })
        .filter(function (imp) {
        return imp.moduleSpecifier.text === importPath;
    })
        .filter(function (imp) {
        if (!imp.importClause) {
            return false;
        }
        var nodes = findNodes(imp.importClause, ts.SyntaxKind.ImportSpecifier)
            .filter(function (n) { return n.getText() === classifiedName; });
        return nodes.length > 0;
    });
    return matchingNodes.length > 0;
}
function findNodes(node, kind, max) {
    if (max === void 0) { max = Infinity; }
    if (!node || max === 0) {
        return [];
    }
    var arr = [];
    if (node.kind === kind) {
        arr.push(node);
        max--;
    }
    if (max > 0) {
        for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
            var child = _a[_i];
            findNodes(child, kind, max).forEach(function (node) {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });
            if (max <= 0) {
                break;
            }
        }
    }
    return arr;
}
function getSourceNodes(sourceFile) {
    var nodes = [sourceFile];
    var result = [];
    while (nodes.length > 0) {
        var node = nodes.shift();
        if (node) {
            result.push(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift.apply(nodes, node.getChildren());
            }
        }
    }
    return result;
}
function getRelativePath(source, target) {
    var sep = '/';
    var targetArr = target.split(sep);
    var sourceArr = source.split(sep);
    sourceArr.pop();
    var targetFileName = targetArr.pop();
    var targetPath = targetArr.join(sep);
    var relativePath = '';
    if (sourceArr.join(sep) === targetPath) {
        return './' + targetFileName;
    }
    while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
        sourceArr.pop();
        relativePath += '..' + sep;
    }
    var relPathArr = targetArr.slice(sourceArr.length);
    if (relPathArr.length) {
        relativePath += relPathArr.join(sep) + sep;
    }
    var prefix = relativePath.indexOf('..') === 0 ? '' : './';
    return prefix + relativePath + targetFileName;
}
function nodesByPosition(first, second) {
    return first.getStart() - second.getStart();
}


/***/ })
/******/ ]);