class Item {
    constructor(pk, sk) {
        this.pk = pk;
        this.sk = sk;
    }

    static parseDynamoDbItem(item) {
        if(!item) {
            throw new Error('No item!');
        }

        const {PK, SK, ...rest} = item;

        return {pk: PK, sk: SK, rest: rest};
    }

    keys() {
        return {
            PK: this.pk,
            SK: this.sk,
        }
    }
}

module.exports = Item;