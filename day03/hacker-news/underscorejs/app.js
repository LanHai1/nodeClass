let _ = require('underscore');
// let zip = _.zip(['ni', 'aa', 'dd'], [30, 2, 90], [true, false, true]);
// console.log(zip);
// console.log(_.unzip(zip));
// var greet = function (name) { return "hi: " + name; };
// var exclaim = function (statement) { return statement.toUpperCase() + "!"; };
// var welcome = _.compose(greet, exclaim);
// console.log(welcome('moe'));

let html = '<h2><%= name %></h2>';
let fn = _.template(html);
html = fn({ name: '大大' });
console.log(html);

console.log(fn.toString());