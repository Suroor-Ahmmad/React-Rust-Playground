import { exec } from "child_process";

interface Error {
    error: string;
    stderror: string;
    stdout: string;
}

export class Service {

    async executeScript() {

        let result = await exec("hello");
        // , (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return error.message;
        //     }
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //         return stderr;
        //     }
        //     exec('hello', (error, stdout, stderr) => {
        //         console.log(stdout);
        //         return stdout
        //     })
        // });
        let data =  result.stdout?.on('data', data => { return data });
        console.log(data);
        
    }
}