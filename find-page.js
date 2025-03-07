const axios = require('axios');

module.exports = function (RED) {
    function FindPageInNotion(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', async function (msg) {
            try {
                const notionApiKey = config.notionApiKey || msg.notionApiKey;
                const databaseId = config.databaseId || msg.databaseId;
                const query = config.query || msg.query;

                const response = await axios.post(
                    `https://api.notion.com/v1/databases/${databaseId}/query`,
                    {
                        filter: {
                            property: 'Title',
                            text: {
                                contains: query,
                            },
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${notionApiKey}`,
                            'Notion-Version': '2021-05-13',
                        },
                    }
                );

                msg.payload = response.data;
                node.send(msg);
            } catch (error) {
                node.error(error.message, msg);
            }
        });
    }
    RED.nodes.registerType('find-page-in-notion', FindPageInNotion);
};