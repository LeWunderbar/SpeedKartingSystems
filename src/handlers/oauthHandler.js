const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const { client } = require("./clientHandler")
const { update } = require("./../utils/updateDiscordUser")
const { OAUTH_CLIENT_ID } = require("./../../config.json");
const log = require('../utils/log');
const schema = require("./../schema/schema")

require('dotenv').config()

module.exports = () => {
    app.get('/auth/roblox/callback', async (req, res) => {
        const code = String(req.query.code);
        const state = req.query.state
        try {
            const data = await schema.find({ statecode: state }).exec();

            if (data.length === 0) {
                res.send('An error occurred');
                res.status(404);
                res.end();
            } else {
                const user = await client.users.fetch(data[0].discordID);
                if (!user) {
                    res.send('An error occurred');
                    res.status(404);
                    res.end();
                } else {
                    res.status(200);
                    res.send('You have been verified successfully, You can now close this page!'); // Better Success screen

                    const params = new URLSearchParams();
                    params.append("client_id", OAUTH_CLIENT_ID);
                    params.append("client_secret", process.env.OAUTH_TOKEN);
                    params.append("grant_type", "authorization_code");
                    params.append("code", code);

                    const tokenResponse = await axios.post(`https://apis.roblox.com/oauth/v1/token`, params, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    let RobloxUserId = null
                    if (tokenResponse.status === 200) {
                        const { access_token } = tokenResponse.data;

                        const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        });

                        if (userResponse.status === 200) {
                            const userInfo = await userResponse.json();
                            data[0].verified = true;
                            data[0].robloxID = userInfo.sub;
                            data[0].robloxUsername = userInfo.preferred_username;
                            data[0].statecode = null;
                            await data[0].save();

                            RobloxUserId = userInfo.sub
                            DiscordUserId = user.id

                            await update(RobloxUserId, DiscordUserId)

                        } else {
                            res.send('Error'); // Better Error Screen
                        }
                    } else {
                        res.send('Error'); // Better Error Screen
                    }
                }
            }
        } catch (err) {
            console.log(err)
            res.send('An error occurred'); // Better Error Screen
            res.status(500);
            res.end();
        }
    });

    app.listen(port, () => {
    log(`\x1b[38;2;249;199;79m[Oauth] \x1b[32mPort ${port}\x1b[0m has been exposed and Service Online.`)
    });
};
