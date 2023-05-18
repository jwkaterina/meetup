import PathJumper from "../src/service/path-jumper";
import { Context } from "../src/ctx";

describe('PathJumper', () => {

    it('should parse url', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            pathname: '/#2023-05-15/01H0J01780Y2ATSEM5CJZKSBBZ'
        };

        PathJumper.parsePath();
        const ctx = Context.getInstance();

        expect(ctx.parsedEventId).toBe('01H0J01780Y2ATSEM5CJZKSBBZ');
        expect(ctx.weekStart.getTime()).toBe(1684108800000);
    });
});