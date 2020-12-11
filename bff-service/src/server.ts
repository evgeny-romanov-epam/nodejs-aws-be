import express from 'express';
import {AxiosStatic, Method} from "axios";

require('dotenv').config();
const axios: AxiosStatic = require('axios').default;

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.all('/*', (req, res) => {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log('recipient', recipient);

    const recipientUrl = process.env[recipient];
    if (recipientUrl) {
        const axiosConfig = {
            url: `${recipientUrl}${req.originalUrl}`,
            method: req.method as Method,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };
        console.log(axiosConfig);

        axios(axiosConfig).then(response => {
            console.log('axios response', response)
            res.json(response.data);
        }).catch(error => {
            console.error('axios error', JSON.stringify(error));
            if (error.response) {
                const {data, status} = error.response;
                res.status(status).json(data);
            } else {
                res.status(500).json({error: error.message});
            }
        })
    } else {
        res.status(502).json({error: 'Cannot process request'})
    }

})

const server = app.listen(app.get('port'), () => {
    console.log(
        'App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );

    console.log('Press CTRL-C to stop\n');
});

export default server;
