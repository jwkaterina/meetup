class MeetupChangeEntity {
    constructor(eventName, oldMeetup, newMeetup, changes) {
        this.type = eventName;
        this.oldMeetup = oldMeetup;
        this.newMeetup = newMeetup;
        this.changes = changes;
    }
}

module.exports = MeetupChangeEntity;