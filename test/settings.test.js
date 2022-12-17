import {Settings} from '../src/settings'

describe('Settings', function () {
    Settings.initInstance(1, 2, 3)

    it('should match dayStarts', () => {
        expect(Settings.getInstance().dayStarts).toBe(1)
    })

    it('should match dayEnds', () => {
        expect(Settings.getInstance().dayEnds).toBe(2)
    })

    it('should match slotHeight', () => {
        expect(Settings.getInstance().slotHeight).toBe(3)
    })
})