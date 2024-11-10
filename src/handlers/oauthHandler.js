const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const { client } = require("./clientHandler")
const { update } = require("./../utils/updateDiscordUser")
const { OAUTH_CLIENT_ID } = require("./../../config.json");
const log = require('../utils/log');
const schema = require("./../schema/verifying")

require('dotenv').config()

module.exports = () => {
    app.get('/auth/roblox/callback', async (req, res) => {
        const code = String(req.query.code);
        const state = req.query.state;
        let message = '';
        let messageClass = '';
    
        try {
            const data = await schema.find({ statecode: state }).exec();
    
            if (data.length === 0) {
                message = 'An error occurred. Please try again.';
                messageClass = 'error';
            } else {
                const user = await client.users.fetch(data[0].discordID);
                if (!user) {
                    message = 'An error occurred. Please try again.';
                    messageClass = 'error';
                } else {
                    const params = new URLSearchParams();
                    params.append("client_id", OAUTH_CLIENT_ID);
                    params.append("client_secret", process.env.OAUTH_TOKEN);
                    params.append("grant_type", "authorization_code");
                    params.append("code", code);
    
                    const tokenResponse = await axios.post(`https://apis.roblox.com/oauth/v1/token`, params, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
    
                    if (tokenResponse.status === 200) {
                        const { access_token } = tokenResponse.data;
    
                        const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
                            headers: { Authorization: `Bearer ${access_token}` }
                        });
    
                        if (userResponse.status === 200) {
                            const userInfo = await userResponse.json();
                            data[0].verified = true;
                            data[0].robloxID = userInfo.sub;
                            data[0].robloxUsername = userInfo.preferred_username;
                            data[0].statecode = null;
                            await data[0].save();
    
                            await update(userInfo.sub, user.id);
                            message = 'You have been verified successfully, You can now close this page!';
                            messageClass = 'success';
                        } else {
                            message = 'Error fetching Roblox user info.';
                            messageClass = 'error';
                        }
                    } else {
                        message = 'Error during authentication with Roblox.';
                        messageClass = 'error';
                    }
                }
            }
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred in OauthHandler:\n\x1b[0m${err}`)
            message = 'An unexpected error occurred.';
            messageClass = 'error';
        }
    
        // Serve the HTML response
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SpeedKarting Systems - OAuth Callback</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #171717;
                        color: white;
                        margin: 0;
                        padding: 0;
                    }
                    header {
                        display: flex;
                        align-items: center;
                        background-color: #333;
                        padding: 20px;
                        text-align: left;
                    }
                    header h1 {
                        margin: 0;
                        color: #f55a42;
                        margin-left: 10px;
                    }
                    .icon {
                        width: 50px;
                        height: 50px;
                        vertical-align: middle;
                        border-radius: 50%;
                    }
                    .status-bar {
                        padding: 15px;
                        text-align: center;
                        font-size: 18px;
                        font-weight: bold;
                        color: white;
                        margin-top: 20px;
                    }
                    .success {
                        background-color: #64e653;
                    }
                    .error {
                        background-color: red;
                    }
                </style>
            </head>
            <body>
                <header>
                    <img src="https://cdn.discordapp.com/avatars/1304742881625636934/8deb564da0bd1e42590f4a471363a078?size=1024" class="icon" alt="SpeedKarting Icon" />
                    <h1>SpeedKarting Systems</h1>
                </header>
                <div class="status-bar ${messageClass}">
                    ${message}
                </div>
            </body>
            </html>
        `);
    });
    
    app.listen(port, () => {
    log(`\x1b[38;2;249;199;79m[Oauth] \x1b[32mPort ${port}\x1b[0m has been exposed and Service Online.`)
    });
};
