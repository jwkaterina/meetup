const EntityError = require('./entity-error');

class Item {
    constructor(pk, sk) {
        this.pk = pk;
        this.sk = sk;
    }

    static parseDynamoDbItem(item) {
        if(!item) {
            throw new EntityError('No item!');
        }

        const {PK, SK, ...rest} = item;

        return {pk: PK, sk: SK, rest: rest};
    }
    
    static parseDynamoDbEvent(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        if(!evt.Keys) {
            console.log('Broken DynamoDb Event Item. No dynamodb.Keys');
            return null;
        }

        if(!evt.Keys.PK) {
            console.log('Broken DynamoDb Event Item. No dynamodb.Keys.PK');
            return null;
        }

        if(!evt.Keys.PK.S) {
            console.log('Broken DynamoDb Event Item. No dynamodb.Keys.PK.S');
            return null;
        }

        const PK = evt.Keys.PK.S;

        if(!evt.Keys.SK) {
            console.log('Broken DynamoDb Event Item. No dynamodb.Keys.SK');
            return null;
        }

        if(!evt.Keys.SK.S) {
            console.log('Broken DynamoDb Event Item. No dynamodb.Keys.SK.S');
            return null;
        }

        const SK = evt.Keys.SK.S;

        return {pk: PK, sk: SK};
    }

    keys() {
        return {
            PK: this.pk,
            SK: this.sk,
        }
    }
}

module.exports = Item;