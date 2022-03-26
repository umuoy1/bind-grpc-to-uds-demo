const grpc = require('@grpc/grpc-js')

const hello_proto = require('./proto')

function sayHello(call, callback) {
    callback(null, { message: 'Hello ' + call.request.name });
}

const socketPath = process.env.SOCKET_PATH

const server = new grpc.Server()
server.addService(hello_proto.Greeter.service, { sayHello: sayHello })
server.bindAsync('unix://' + socketPath, grpc.ServerCredentials.createInsecure(), () => {
    server.start()
    process.stdout.write("OK")
})