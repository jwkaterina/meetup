
class Set {
    constructor(dayStarts, dayEnds, slotHeight){
        this.dayStarts = dayStarts;
        this.dayEnds = dayEnds;
        this.slotHeight = slotHeight;
    }
}

export const Settings = (function() {
    let instance;
  
    return {
      getInstance: function() {
        return instance;
      },
      initInstance: function(dayStarts, dayEnds, slotHeight) {
        if(!instance){
            instance = new Set(dayStarts, dayEnds, slotHeight);
            Object.freeze(instance);
        } else {
            throw new Error("You must not create a Settings instance multiple times.");
        }
      }
    }
  })();