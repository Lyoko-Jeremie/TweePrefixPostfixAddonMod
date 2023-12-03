import type {SC2Passage} from "../../../dist-BeforeSC2/SC2ApiRef";
import type {LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";

export interface ModCallback {
    modName: string;
    callback: TweePrefixPostfixAddonCallback;
}

// all must sync impl, and must fastest
export interface TweePrefixPostfixAddonCallback {
    /**
     * return new passage text
     * @param text
     * @param passageTitle
     * @param passageObj
     */
    beforePassage?: (text: string, passageTitle: string, passageObj: SC2Passage) => string;
    afterPassage?: (text: string, passageTitle: string, passageObj: SC2Passage) => void;
    /**
     * return new wikify text
     * @param text
     */
    beforeWikify?: (text: string) => string;
    afterWikify?: (text: string) => void;
    /**
     * return new widget text
     * @param text
     * @param widgetName
     * @param passageTitle
     * @param passageObj
     */
    beforeWidget?: (text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) => string;
    afterWidget?: (text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) => void;
}

export class TweePrefixPostfixAddonCallbackOrder {
    beforePassage: ModCallback[] = [];
    afterPassage: ModCallback[] = [];
    beforeWikify: ModCallback[] = [];
    afterWikify: ModCallback[] = [];
    beforeWidget: ModCallback[] = [];
    afterWidget: ModCallback[] = [];

    addCallback(c: ModCallback) {
        if (c.callback.beforePassage) {
            this.beforePassage.push(c);
        }
        if (c.callback.afterPassage) {
            this.afterPassage.push(c);
        }
        if (c.callback.beforeWikify) {
            this.beforeWikify.push(c);
        }
        if (c.callback.afterWikify) {
            this.afterWikify.push(c);
        }
        if (c.callback.beforeWidget) {
            this.beforeWidget.push(c);
        }
        if (c.callback.afterWidget) {
            this.afterWidget.push(c);
        }
    }

    removeCallback(c: ModCallback) {
        const n = this.beforePassage.find(T => T.modName === c.modName);
        if (!n) {
            // never go there
            console.error('TweePrefixPostfixAddonCallbackOrder.removeCallback: never go there', c);
            return;
        }
        if (c.callback.beforePassage) {
            this.beforePassage.splice(this.beforePassage.indexOf(n), 1);
        }
        if (c.callback.afterPassage) {
            this.afterPassage.splice(this.afterPassage.indexOf(n), 1);
        }
        if (c.callback.beforeWikify) {
            this.beforeWikify.splice(this.beforeWikify.indexOf(n), 1);
        }
        if (c.callback.afterWikify) {
            this.afterWikify.splice(this.afterWikify.indexOf(n), 1);
        }
        if (c.callback.beforeWidget) {
            this.beforeWidget.splice(this.beforeWidget.indexOf(n), 1);
        }
        if (c.callback.afterWidget) {
            this.afterWidget.splice(this.afterWidget.indexOf(n), 1);
        }
    }
}

export class TweePrefixPostfixAddonCallbackCount {
    beforePassage = 0;
    afterPassage = 0;
    beforeWikify = 0;
    afterWikify = 0;
    beforeWidget = 0;
    afterWidget = 0;

    order = new TweePrefixPostfixAddonCallbackOrder();

    addCallback(c: ModCallback) {
        if (c.callback.beforePassage) {
            this.beforePassage++;
        }
        if (c.callback.afterPassage) {
            this.afterPassage++;
        }
        if (c.callback.beforeWikify) {
            this.beforeWikify++;
        }
        if (c.callback.afterWikify) {
            this.afterWikify++;
        }
        if (c.callback.beforeWidget) {
            this.beforeWidget++;
        }
        if (c.callback.afterWidget) {
            this.afterWidget++;
        }
        this.order.addCallback(c);
    }

    removeCallback(c: ModCallback) {
        if (c.callback.beforePassage) {
            this.beforePassage--;
        }
        if (c.callback.afterPassage) {
            this.afterPassage--;
        }
        if (c.callback.beforeWikify) {
            this.beforeWikify--;
        }
        if (c.callback.afterWikify) {
            this.afterWikify--;
        }
        if (c.callback.beforeWidget) {
            this.beforeWidget--;
        }
        if (c.callback.afterWidget) {
            this.afterWidget--;
        }
        this.order.removeCallback(c);
    }

    checkDataValid() {
        // order data length must === count
        let ok = true;
        if (this.order.beforePassage.length !== this.beforePassage) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: beforePassage length not match', [this.order.beforePassage, this.beforePassage]);
            ok = false;
        }
        if (this.order.afterPassage.length !== this.afterPassage) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: afterPassage length not match', [this.order.afterPassage, this.afterPassage]);
            ok = false;
        }
        if (this.order.beforeWikify.length !== this.beforeWikify) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: beforeWikify length not match', [this.order.beforeWikify, this.beforeWikify]);
            ok = false;
        }
        if (this.order.afterWikify.length !== this.afterWikify) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: afterWikify length not match', [this.order.afterWikify, this.afterWikify]);
            ok = false;
        }
        if (this.order.beforeWidget.length !== this.beforeWidget) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: beforeWidget length not match', [this.order.beforeWidget, this.beforeWidget]);
            ok = false;
        }
        if (this.order.afterWidget.length !== this.afterWidget) {
            console.error('TweePrefixPostfixAddonCallbackCount.checkDataValid: afterWidget length not match', [this.order.afterWidget, this.afterWidget]);
            ok = false;
        }
        return ok;
    }
}


export class TweePrefixPostfixAddonJsCallback {
    private logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
    }

    private callbackTable: Map<string, ModCallback> = new Map<string, ModCallback>();
    private callbackOrder: string[] = [];
    private callbackCount = new TweePrefixPostfixAddonCallbackCount();

    public addCallback(key: string, callback: TweePrefixPostfixAddonCallback) {
        const cb: ModCallback = {
            modName: key,
            callback: callback,
        };
        if (this.callbackTable.has(key)) {
            console.warn('TweePrefixPostfixAddonJsCallback.addCallback: key already exists', [key, callback, this.callbackTable.get(key)]);
            this.logger.warn(`TweePrefixPostfixAddonJsCallback.addCallback: key already exists [${key}]`,);
            this.callbackCount.removeCallback(this.callbackTable.get(key)!);
            this.callbackOrder.splice(this.callbackOrder.indexOf(key), 1);
        }
        this.callbackTable.set(key, cb);
        this.callbackOrder.push(key);
        this.callbackCount.addCallback(cb);
        if (!this.callbackCount.checkDataValid()) {
            // never go there
            console.error('TweePrefixPostfixAddonJsCallback.addCallback: checkDataValid failed', [this.callbackTable, this.callbackOrder, this.callbackCount]);
            this.logger.error(`TweePrefixPostfixAddonJsCallback.addCallback: checkDataValid failed`);
        }
    }

    beforePassage(text: string, passageTitle: string, passageObj: SC2Passage) {
        if (this.callbackCount.beforePassage === 0) {
            // short stop
            return text;
        }
        for (const cb of this.callbackCount.order.beforePassage) {
            if (cb.callback.beforePassage) {
                try {
                    text = cb.callback.beforePassage(text, passageTitle, passageObj);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.beforePassage', [cb, [text, passageTitle, passageObj], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.beforePassage: cb.callback.beforePassage not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return text;
    }

    afterPassage(text: string, passageTitle: string, passageObj: SC2Passage) {
        if (this.callbackCount.afterPassage === 0) {
            // short stop
            return;
        }
        for (const cb of this.callbackCount.order.afterPassage) {
            if (cb.callback.afterPassage) {
                try {
                    cb.callback.afterPassage(text, passageTitle, passageObj);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.afterPassage', [cb, [text, passageTitle, passageObj], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.afterPassage: cb.callback.afterPassage not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return;
    }

    beforeWikify(text: string) {
        if (this.callbackCount.beforeWikify === 0) {
            // short stop
            return text;
        }
        for (const cb of this.callbackCount.order.beforeWikify) {
            if (cb.callback.beforeWikify) {
                try {
                    text = cb.callback.beforeWikify(text);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.beforeWikify', [cb, [text], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.beforeWikify: cb.callback.beforeWikify not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return text;
    }

    afterWikify(text: string) {
        if (this.callbackCount.afterWikify === 0) {
            // short stop
            return;
        }
        for (const cb of this.callbackCount.order.afterWikify) {
            if (cb.callback.afterWikify) {
                try {
                    cb.callback.afterWikify(text);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.afterWikify', [cb, [text], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.afterWikify: cb.callback.afterWikify not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return;
    }

    beforeWidget(text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) {
        if (this.callbackCount.beforeWidget === 0) {
            // short stop
            return text;
        }
        for (const cb of this.callbackCount.order.beforeWidget) {
            if (cb.callback.beforeWidget) {
                try {
                    text = cb.callback.beforeWidget(text, widgetName, passageTitle, passageObj);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.beforeWidget', [cb, [text, widgetName, passageTitle, passageObj], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.beforeWidget: cb.callback.beforeWidget not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return text;
    }

    afterWidget(text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) {
        if (this.callbackCount.afterWidget === 0) {
            // short stop
            return;
        }
        for (const cb of this.callbackCount.order.afterWidget) {
            if (cb.callback.afterWidget) {
                try {
                    cb.callback.afterWidget(text, widgetName, passageTitle, passageObj);
                } catch (e: Error | any) {
                    console.error('TweePrefixPostfixAddonJsCallback.afterWidget', [cb, [text, widgetName, passageTitle, passageObj], e]);
                }
            } else {
                // never go there
                console.error('TweePrefixPostfixAddonJsCallback.afterWidget: cb.callback.afterWidget not found', [cb, this.callbackCount, this.callbackOrder, this.callbackTable]);
            }
        }
        return;
    }
}
