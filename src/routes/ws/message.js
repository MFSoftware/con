export default (wsapi) => {
    wsapi.on('new_message', data => {
        console.log('ok');
    });
}