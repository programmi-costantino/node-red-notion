const axios = require('axios');

module.exports = function (RED) {
    function GetPagesByFilters(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.notionApiKey = config.notionApiKey;
        node.databaseId = config.databaseId;
        node.filters = config.filters;

        node.on('input', async function (msg) {
            const notionApiKey = msg.notionApiKey || node.notionApiKey;
            const databaseId = msg.databaseId || node.databaseId;
            const filters = msg.filters || node.filters;

            if (!notionApiKey || !databaseId || !filters) {
                node.error('Missing required parameters: notionApiKey, databaseId, or filters', msg);
                return;
            }

            try {
                const response = await axios.post(
                    `https://api.notion.com/v1/databases/${databaseId}/query`,
                    {
                        filter: JSON.parse(filters),
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
    RED.nodes.registerType('get-pages-by-filters', GetPagesByFilters);
};