const Item = require('./item');
const EntityError = require('./entity-error');
const MeetupEntity = require('./meetup-entity');
const MeetupChangeEntity = require('./meetup-change-entity');
const MeetupNotificationEntity = require('./meetup-notification');

class MeetupChangeEvent {

    /**
    * Use this API to check if a dynamoDb event is of MeetupUpdateEvent type.
    * If yes, the entity returned.
    * Otherwise null returned.
    */
    static parseDynamoDbEvent(evtName, evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        const keys = Item.parseDynamoDbEvent(evt);

        if(!keys) {
            return null;
        }

        if(!keys.pk.startsWith(MeetupEntity.PK_PREFIX)) {
            return null;
        }

        if(!keys.sk.startsWith(MeetupEntity.SK_PREFIX)) {
            return null;
        }

        if(evtName === 'MODIFY') {
            return MeetupUpdateEvent.parseDynamoDbModifyEvent(evt);
        }

        if(evtName === 'REMOVE') {
            return MeetupDeleteEvent.parseDynamoDbRemoveEvent(evt);
        }

        return null;
    }

    static parseNewIgamge(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        return MeetupChangeEvent.parseImage("NewImage", evt.NewImage);
    }

    static parseOldIgamge(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        return MeetupChangeEvent.parseImage("OldImage", evt.OldImage);
    }

    static parseImage(name, image) {
        if(!image) {
            console.log(`No dynamoDB ${name} Item!`);
            return null;
        }

        const pk = MeetupChangeEvent.parsePK(name, evt[name]);

        if (!pk) {
            return null;
        }

        const sk = MeetupChangeEvent.parseSK(name, evt[name]);

        if (!sk) {
            return null;
        }

        const date = MeetupChangeEvent.parseDate(name, evt[name]);

        if (!date) {
            return null;
        }

        const start = MeetupChangeEvent.parseStart(name, evt[name]);

        if (!start) {
            return null;
        }

        const end = MeetupChangeEvent.parseEnd(name, evt[name]);

        if (!end) {
            return null;
        }

        return new MeetupEntity(pk, sk, date, start, end);
    }

    static parsePK(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return null;
        }

        if (!image.PK) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.PK`);
            return null;
        }

        if (!image.PK.S) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.PK.S`);
            return null;
        }
        return image.PK.S;
    }

    static parseSK(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return null;
        }

        if (!image.SK) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.SK`);
            return null;
        }

        if (!image.SK.S) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.SK.S`);
            return null;
        }
        return image.SK.S;
    }

    static parseDate(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return null;
        }

        if (!image.date) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.date`);
            return null;
        }

        if (!image.date.S) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.date.S`);
            return null;
        }
        return image.date.S;
    }

    static parseStart(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return null;
        }

        if (!image.start) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.start`);
            return null;
        }

        if (!image.start.S) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.start.S`);
            return null;
        }
        return image.start.S;
    }

    static parseEnd(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return null;
        }

        if (!image.end) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.end`);
            return null;
        }

        if (!image.end.S) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.end.S`);
            return null;
        }
        return image.end.S;
    }

    static parseUserIds(imageName, image) {
        if(!image) {
            console.log(`No dynamoDB ${imageName} Item!`);
            return [];
        }

        if (!image.memberIds) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.memberIds`);
            return [];
        }

        if (!image.memberIds.L) {
            console.log(`Broken MeetupChangeEvent DynamoDb Item. No ${imageName}.memberIds.L`);
            return [];
        }

        const ids = image.memberIds.L
        .map(item => item.S)
        .filter(value => value ? true : false);

        return ids;
    }
}

class MeetupUpdateEvent extends MeetupChangeEvent {
    constructor() {
        super();
    }

    /**
    * Use this API to check if a dynamoDb event is of MeetupUpdateEvent type.
    * If yes, the entity returned.
    * Otherwise null returned.
    */
    static parseDynamoDbModifyEvent(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        const oldMeetup = super.parseOldIgamge(evt);

        if (!oldMeetup) {
            return null;
        }
        
        const newMeetup = super.parseNewIgamge(evt);

        if (!newMeetup) {
            return null;
        }

        const changes = oldMeetup.diff(newMeetup);

        if(!changes) {
            return null;
        }

        const userIds = super.parseUserIds("OldImage", evt.OldImage);
        const meetupChange = new MeetupChangeEntity('MEETUP_UPDATE', oldMeetup, newMeetup, changes);

        return new MeetupNotificationEntity(userIds, meetupChange);
    }
}

class MeetupDeleteEvent extends MeetupChangeEvent {
    constructor() {
        super();
    }

    /**
    * Use this API to check if a dynamoDb event is of MeetupUpdateEvent type.
    * If yes, the entity returned.
    * Otherwise null returned.
    */
    static parseDynamoDbRemoveEvent(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        const meetup = super.parseOldIgamge(evt);

        if (!meetup) {
            return null;
        }

        const userIds = super.parseUserIds("OldImage", evt.OldImage);
        const meetupChange = new MeetupChangeEntity('MEETUP_DELETE', meetup, null, null);

        return new MeetupNotificationEntity(userIds, meetupChange);
    }
}

module.exports = MeetupChangeEvent;