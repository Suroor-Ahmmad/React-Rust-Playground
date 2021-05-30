import React from 'react';
import './Header.scss';

interface Props {
    setExecution: () => void;
}

export const Header: React.FC<Props> = ({ setExecution }) => {
    return (
        <div className="header">
            <div className="text">Rust Playground</div>
            <div className="button-outer">
                <button className="button" onClick={setExecution}>
                    Execute
                </button>
            </div>
            <div></div>
        </div>
    );
};
