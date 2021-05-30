import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

import { Editor } from './components/Editor/Editor';
import { Header } from './components/Header/Header';
import { execute } from './services/http';

function App() {
    const socket = socketIOClient('http://localhost:4200');
    const [exeState, setExeState] = useState('');
    const [dataState, setDataState] = useState('');

    const setExecution = async () => {
        if (exeState) {
            // Using express
            // const data = await execute(exeState);
            
            //Using socket
            socket.emit('execute', { data: exeState });
            socket.on('post-execute', (data: any) => {
                console.log(data);
                setDataState(data);
            });
            // setDataState(data.data);
        } else {
            console.log('Emty');
        }
    };

    useEffect(() => {
        socket.on('connect', () => console.log('Connected to server'));
    }, []);

    const getEditorData = (newValue: string) => {
        console.log(newValue);
        setExeState(newValue);
    };

    return (
        <div className="App">
            <Header setExecution={setExecution} />
            <Editor setEditorText={getEditorData} dataState={dataState} />
        </div>
    );
}

export default App;
