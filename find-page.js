const axios = require('axios');

module.exports = function (RED) {
    function FindPageInNotion(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.notionApiKey = config.notionApiKey;
        node.databaseId = config.databaseId;
        node.query = config.query;

        node.on('input', async function (msg) {
            const notionApiKey = msg.notionApiKey || node.notionApiKey;
            const databaseId = msg.databaseId || node.databaseId;
            const query = msg.query || node.query;

            if (!notionApiKey || !databaseId || !query) {
                node.error('Missing required parameters: notionApiKey, databaseId, or query', msg);
                return;
            }

            try {
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