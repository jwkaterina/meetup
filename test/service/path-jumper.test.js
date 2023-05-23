import PathJumper from "../../src/service/path-jumper";
import { Context } from "../../src/ctx";

describe('PathJumper', () => {

    beforeEach(() => {
        const ctx = Context.getInstance();
        ctx.parsedEventId = null;
        ctx.weekStart = null;
    });

    it('should parse url and populate the Context if hash present', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            hash: '#2023-05-15/01H0J01780Y2ATSEM5CJZKSBBZ'
        };

        PathJumper.parsePath();
        const ctx = Context.getInstance();

        expect(ctx.parsedEventId).toBe('01H0J01780Y2ATSEM5CJZKSBBZ');
        expect(ctx.weekStart.getDate()).toBe(15);
    });

    it('should parse url and not populate the Context if no hash', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            hash: ''
        };

        PathJumper.parsePath();
        const ctx = Context.getInstance();

        expect(ctx.parsedEventId).toBe(null);
        expect(ctx.weekStart).toBe(null);
    });
});