"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app = express_1.default();
const port = 4200;
let server = http_1.createServer(app);
let io = new socket_io_1.Server(server, { cors: { origin: '*' } });
server.listen(port, () => { console.log(`Server running at port: ${port}`); });
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: false }));
io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('execute', (data) => {
        console.log(data);
        fs.writeFile('./src/hello.rs', data.data, function (err) {
            if (err)
                throw err;
            console.log('Saved!');
        });
        child_process_1.exec('rustc ./src/hello.rs', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                socket.emit('post-execute', { error: error.message, stderror: '', stdout: '' });
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                socket.emit('post-execute', { error: '', stderror: stderr, stdout: '' });
                ;
            }
            child_process_1.exec('hello', (error, stdout, stderr) => {
                if (error) {
                    socket.emit('post-execute', { error: error.message, stderror: '', stdout: '' });
                }
                if (stderr) {
                    socket.emit('post-execute', { error: '', stderror: stderr, stdout: '' });
                }
                console.log(stdout);
                socket.emit('post-execute', { error: '', stderror: '', stdout: stdout });
            });
        });
        // socket.emit('post-execute', {data: 'hello'})
    });
});
app.get('/', (req, res) => {
    res.send('Health check success');
});
app.post('/execute', (req, res) => {
    console.log(req.body.query);
    fs.writeFile('./src/hello.rs', req.body.query, function (err) {
        if (err)
            throw err;
        console.log('Saved!');
    });
    child_process_1.exec('rustc ./src/hello.rs', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.send({ error: error.message, stderror: '', stdout: '' });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.send({ error: '', stderror: stderr, stdout: '' });
            ;
        }
        child_process_1.exec('hello', (error, stdout, stderr) => {
            if (error) {
                return res.send({ error: error.message, stderror: '', stdout: '' });
            }
            if (stderr) {
                return res.send({ error: '', stderror: stderr, stdout: '' });
            }
            console.log(stdout);
            return res.send({ error: '', stderror: '', stdout: stdout });
        });
    });
});
//# sourceMappingURL=index.js.map