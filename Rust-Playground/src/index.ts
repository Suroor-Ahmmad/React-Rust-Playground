import { exec } from 'child_process';
import cors from 'cors';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const port = 4200;

let server = createServer(app);
let io = new Server(server, { cors: { origin: '*' } });

interface Data {
    error: string;
    stderror: string;
    stdout: string;
}

type Send<T = Response> = (body?: Data) => T;

interface CustomResponse extends Response {
    send: Send<this>;
}

server.listen(port, () => { console.log(`Server running at port: ${port}`) });
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('execute', (data: any) => {
        console.log(data);
        fs.writeFile('./src/hello.rs', data.data, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        exec('rustc ./src/hello.rs', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                socket.emit('post-execute', { error: error.message, stderror: '', stdout: '' });
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                socket.emit('post-execute', { error: '', stderror: stderr, stdout: '' });;
            }
            exec('hello', (error, stdout, stderr) => {
                if (error) {
                    socket.emit('post-execute', { error: error.message, stderror: '', stdout: '' });
                }
                if (stderr) {
                    socket.emit('post-execute', { error: '', stderror: stderr, stdout: '' });
                }
                console.log(stdout);
                socket.emit('post-execute', { error: '', stderror: '', stdout: stdout });
            })
        });
        // socket.emit('post-execute', {data: 'hello'})
    });
});

app.get('/', (req, res) => {
    res.send('Health check success');
});

app.post('/execute', (req: Request, res: CustomResponse) => {
    console.log(req.body.query);
    fs.writeFile('./src/hello.rs', req.body.query, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    exec('rustc ./src/hello.rs', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.send({ error: error.message, stderror: '', stdout: '' });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.send({ error: '', stderror: stderr, stdout: '' });;
        }
        exec('hello', (error, stdout, stderr) => {
            if (error) {
                return res.send({ error: error.message, stderror: '', stdout: '' });
            }
            if (stderr) {
                return res.send({ error: '', stderror: stderr, stdout: '' });
            }
            console.log(stdout);
            return res.send({ error: '', stderror: '', stdout: stdout });
        })
    });
});
