import './Editor.css';

import React, { useState } from 'react';
import AceEditor from 'react-ace';
// @ts-ignore
import Terminal from 'react-console-emulator';
import SplitPane from 'react-split-pane';

import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/theme-chaos';

interface Props {
    dataState: any;
    setEditorText: (value: any) => any;
}
export const Editor: React.FC<Props> = ({ setEditorText, dataState }) => {
    const terminal = React.useRef<any>(null);

    React.useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        // if (dataState) {
        //     xtermRef?.current?.terminal.clear('');
        //     xtermRef?.current?.terminal.writeln(
        //         dataState.stdout || dataState.stderror || dataState.error
        //     );
        // }
        terminal.current.clearInput();
        terminal.current.pushToStdout(
            dataState.stdout || dataState.stderror || dataState.error
        );
    }, [dataState]);

    const commands = {
        echo: {
            description: 'Echo a passed string.',
            usage: 'echo <string>',
            fn: function () {
                return `Please wait`;
            },
        },
    };

    return (
        <>
            <SplitPane
                split="vertical"
                defaultSize={800}
                minSize={600}
                maxSize={800}
            >
                <AceEditor
                    className="editor"
                    mode="rust"
                    theme="chaos"
                    width="100%"
                    height="100%"
                    onChange={(value: string) => {
                        setEditorText(value);
                    }}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                    }}
                />
                <div>
                    <Terminal
                        style={{
                            height: '100vh',
                            borderRadius: 0,
                            overflow: 'hidden',
                        }}
                        ref={terminal}
                        commands={commands}
                        welcomeMessage={'Welcome to Rust Playground'}
                    />
                </div>
            </SplitPane>
        </>
    );
};
