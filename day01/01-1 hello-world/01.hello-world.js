let a1 = 10;
let b1 = 20;

function getSum(a, b) {
    return a + b;
}

let result = getSum(a1, b1);
process.stdout.write("运行结果是--:" + result);
console.log("hello-world");

for (var i = 0; i < 10; i++) {
    for (var j = 0; j <= i; j++) {
        // 注意：console.log()输出完毕后是带换行的，所以这样做不可以
        // console.log('*');
        process.stdout.write('* ');
    }
    process.stdout.write('\n');
}