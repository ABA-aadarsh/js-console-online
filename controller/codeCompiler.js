
const {minify}=require("uglify-js")

exports.runCode = async (req, res) => {
    const apiURL=process.env.apiURL
    const apiToken=process.env.apiToken
    console.log(apiURL, apiToken)
    try {
        const { code, lang } = req.body;
        let sanitizedCode=minify(code).code
        const token = apiToken;
        const data = {
            files: [
                {
                    name: 'main.js',
                    content: sanitizedCode,
                },
            ],
        };

        const fetchRes = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (fetchRes.status === 200) {
            const { stdout, stderr, error } = await fetchRes.json();
            if (stderr === "" && error === "") {
                res.status(202).json({
                    title: "Successful Code Execution",
                    status: true,
                    data: stdout
                });
            } else {
                res.status(405).json({
                    title: "Error in Code",
                    status: false,
                    data: stderr+"\n"+error
                });
            }
        }else{
            throw new Error("Error while executing code. See for syntax error.")
        }
    } catch (error) {
        console.log("Error during fetch:", error);
        res.status(405).json({
            title: "Syntax Error",
            status: false,
            data: error.message
        });
    }
};


 // fetch(apiURL, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Token ${token}`,
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    // })
    // .then(response => response.json())
    // .then(result => {
    //     console.log('Result:', result);
    //     return {result}
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     return {result}
    // });