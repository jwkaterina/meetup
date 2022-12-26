/*
* See: https://stackoverflow.com/a/62959586
*/
import { JSDOM } from "jsdom"
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window