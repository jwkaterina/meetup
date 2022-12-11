
// class Set {
//     constructor(dayStarts, dayEnds, slotHeight, slotHeightMobile){
//         this.dayStarts = dayStarts;
//         this.dayEnds = dayEnds;
//         this.slotHeight = slotHeight;
//         this.slotHeightMobile = slotHeightMobile;
//     }
// }

// export const Settings = (() => {
//     let instance;
  
//     return {
//       getInstance: function() {
//         return instance;
//       },
//       initInstance: function(dayStarts, dayEnds, slotHeight, slotHeightMobile) {
//         if(!instance){
//             instance = new Set(dayStarts, dayEnds, slotHeight, slotHeightMobile);
//             Object.freeze(instance);
//         } else {
//             throw new Error("You must not create a Settings instance multiple times.");
//         }
//       }
//     }
//   })();