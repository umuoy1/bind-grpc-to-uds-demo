const cp = require("child_process")
const path = require("path")

const shortid = require("shortid")
const grpc = require("@grpc/grpc-js")

const childPath = path.join(process.cwd(), "child.js")

const SOCKET_PATH = path.join(process.cwd(), '/tmp/', shortid())

function sayHello(call, callback) {
    callback(null, { message: `[${cnt++}] echo: ` + call.request.message })
}

const hello_proto = require("./proto.js")

const child = cp.spawn("node", [childPath], {
    env: {
        SOCKET_PATH
    }
})

child.stdout.on('data', (data) => {
    if (data.toString() === 'OK') {
        const client = new hello_proto.Greeter('unix://' + SOCKET_PATH, grpc.credentials.createInsecure())
        client.sayHello({ name: 'world' }, function (err, response) {
            console.log('Greeting:', response.message);
        });
    }
})

child.stderr.on('data', (data) => {
    console.log(data.toString());
})