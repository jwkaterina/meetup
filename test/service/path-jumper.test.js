import PathJumper from "../../src/service/path-jumper";
import { Context } from "../../src/ctx";

describe('PathJumper', () => {

    beforeEach(() => {
        const ctx = Context.getInstance();
        ctx.parsedEventId = null;
        ctx.weekStart = null;

        delete global.window.location;
        global.window = Object.create(window);
        global.window = {
            origin: 'http://localhost:3000',
            location: {
                hash: ''
            }
        };
    });

    it('should parse url and populate the Context if hash present', () => {
        //init
        const ctx = Context.getInstance();
        global.window.location = {
            hash: '#2023-05-15/01H0J01780Y2ATSEM5CJZKSBBZ'
        };

        //invoke
        PathJumper.parsePath();

        expect(ctx.parsedEventId).toBe('01H0J01780Y2ATSEM5CJZKSBBZ');
        expect(ctx.weekStart.getDate()).toBe(15);
    });

    it('should parse url and not populate the Context if no hash', () => {
        //init
        const ctx = Context.getInstance();

        //invoke
        PathJumper.parsePath();

        expect(ctx.parsedEventId).toBe(null);
        expect(ctx.weekStart).toBe(null);
    });

    it('should generate Link', () => {
        jest
        .spyOn(Context, 'getInstance')
        .mockImplementation(() => {
            return {
                weekStart: new Date('2023-05-15'),
                currentEvent: {
                    id: '01H0J01780Y2ATSEM5CJZKSBBZ'
                }
            }
        });

        const link = PathJumper.generateLink();

        expect(link).toBe('http://localhost:3000/#2023-05-15/01H0J01780Y2ATSEM5CJZKSBBZ');
    });
});