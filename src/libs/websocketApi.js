import validator from 'validator';

export default class WebSocketAPI {
    constructor() {
        this._list = [];
    }

    on(event, callback) {
        this._list.push({ name: event, callback });
    }

    parseEvent(name, data) {
        if (typeof data == 'String' && validator.isJSON(data))
            data = JSON.parse(data);
            
        let searched = this._list.find(element => element.name === name);

        if (searched == null) return false;

        searched.callback(searched.data);
    }
}