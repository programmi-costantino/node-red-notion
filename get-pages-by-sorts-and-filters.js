const axios = require('axios');

module.exports = function (RED) {
    function GetPagesBySortsAndFilters(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.notionApiKey = config.notionApiKey;
        node.databaseId = config.databaseId;
        node.filters = config.filters;
        node.sorts = config.sorts;

        node.on('input', async function (msg) {
            const notionApiKey = msg.notionApiKey || node.notionApiKey;
            const databaseId = msg.databaseId || node.databaseId;
            const filters = msg.filters || node.filters;
            const sorts = msg.sorts || node.sorts;

            if (!notionApiKey || !databaseId || !filters || !sorts) {
                node.error('Missing required parameters: notionApiKey, databaseId, filters, or sorts', msg);
                return;
            }

            try {
                const response = await axios.post(
                    `https://api.notion.com/v1/databases/${databaseId}/query`,
                    {
                        filter: JSON.parse(filters),
                        sorts: JSON.parse(sorts),
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
    RED.nodes.registerType('get-pages-by-sorts-and-filters', GetPagesBySortsAndFilters);
};