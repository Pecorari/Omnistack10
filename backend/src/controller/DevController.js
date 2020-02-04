const axios = require('axios');
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsMinusculo = techs.toLowerCase();
            const techsArray = parseStringAsArray(techsMinusculo);
    
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name: name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })


            const sendSocktetMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocktetMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    },
};
