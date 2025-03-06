module.exports = function(RED) {
    function LowerCaseNode(config){
        RED.nodes.CreateNode(this,config)
        var node = this
        node.on('input',function(msg){
            msg.payload = msg.payload.toLowerCase()
            node.send(msg)
        });
    }
    RED.nodes.registerType('lower-case-cost',LowerCaseNode)
}