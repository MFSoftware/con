export default {
    sendAll(clients, message) {
        for (var i=0; i< clients.length; i++)
            clients[i][1].send(message);
    }
}