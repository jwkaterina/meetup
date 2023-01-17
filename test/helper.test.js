import { dateString, getDayIndex, addDays, generateId } from '../src/helper'

describe('helper.dateString', function () {
    it('should convert date to string', () => {
        //init
        const date = new Date(2022, 11, 17);

        //invoke
        const actual = dateString(date);

        //check
        expect(actual).toBe("2022-12-17");
    })
})

describe('helper.getDayIndex', function () {
    it('should start week from Monday', () => {
        //init
        const date = new Date(2022, 11, 17);

        //invoke
        const actual = getDayIndex(date);

        //check
        expect(actual).toBe(5);
    })

    it('should end week with Sunday', () => {
        //init
        const date = new Date(2022, 11, 11);

        //invoke
        const actual = getDayIndex(date);

        //check
        expect(actual).toBe(6);
    })
})

describe('helper.addDays', function () {
    it('should calculate date from weekstart and dayindex', () => {
        //init
        const weekStart = new Date(2022, 11, 12);
        const dayIndex = 5;

        //invoke
        const actual = addDays(weekStart, dayIndex);

        //check
        expect(actual.getFullYear()).toBe(2022);
        expect(actual.getMonth()).toBe(11);
        expect(actual.getDate()).toBe(17);
    })
})

describe('helper.generateId', function () {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.123456789)
        .mockReturnValueOnce(0.987654321)
        .mockReturnValueOnce(0.432198765);
    });

    it('should generate ID', () => {
        const id = generateId("2023-01-09", 3);
        expect(id).toBe('2023-01-09#H9a');
    })

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    })
})