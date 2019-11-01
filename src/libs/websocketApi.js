import validator from 'validator';

export default class WebSocketAPI {
    constructor() {
        this.list = [];
    }

    on(event, callback) {
        this.list.push({ name: event, callback });
    }

    parseEvent(name, data) {
        if (validator.isJSON(data))
            data = JSON.parse(data);

        let searched = this.list.find(element => element.name === name);

        if (searched == null) return false;

        searched.callback(searched.data);
    }
}