let fs = require('fs');
try {
    fs.writeFile("./xxx/index.html", "try-catch", "utf8", function (err) {
        console.log("OK");
    
    })
} catch (e) {
    console.log("出错了");
}