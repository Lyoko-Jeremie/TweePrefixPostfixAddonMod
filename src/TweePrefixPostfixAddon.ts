import JSZip from "jszip";
import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {AddonPluginHookPointEx} from "../../../dist-BeforeSC2/AddonPlugin";
import type {WikifyTracerCallback} from "../../../dist-BeforeSC2/WikifyTracer";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isString} from 'lodash';
import type {SC2Passage} from "../../../dist-BeforeSC2/SC2ApiRef";
import type {ModZipReader} from "../../../dist-BeforeSC2/ModZipReader";
import {TweePrefixPostfixAddonCallback, TweePrefixPostfixAddonJsCallback} from "./TweePrefixPostfixAddonJsCallback";

export interface TweePrefixPostfixAddonParams {
    passageName?: string;
    widgetName?: string;
    prefix?: string;
    postfix?: string;
}

export class TweePrefixPostfixAddon implements WikifyTracerCallback, AddonPluginHookPointEx {
    private logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
        this._tweePrefixPostfixAddonJsCallback = new TweePrefixPostfixAddonJsCallback(
            gSC2DataManager,
            gModUtils,
        );
        this.gSC2DataManager.getWikifyTracer().addCallback('TweePrefixPostfixAddon', this);
        this.gSC2DataManager.getAddonPluginManager().registerAddonPlugin(
            'TweePrefixPostfixAddon',
            'TweePrefixPostfixAddon',
            this
        );
    }

    private _tweePrefixPostfixAddonJsCallback: TweePrefixPostfixAddonJsCallback;

    public addCallback(key: string, callback: TweePrefixPostfixAddonCallback) {
        try {
            this._tweePrefixPostfixAddonJsCallback.addCallback(key, callback);
        } catch (e: Error | any) {
            // never go there
            console.error('TweePrefixPostfixAddon.addCallback error', e);
            this.logger.error(`TweePrefixPostfixAddon.addCallback error[${e?.message ? e.message : e}]`);
        }
    }

    async registerMod(addonName: string, mod: ModInfo, modZip: ModZipReader) {
        // TODO
    }

    init() {
    }

    beforePassage(text: string, passageTitle: string, passageObj: SC2Passage) {
        this._tweePrefixPostfixAddonJsCallback.beforePassage(text, passageTitle, passageObj);
        return text;
    }

    afterPassage(text: string, passageTitle: string, passageObj: SC2Passage, node: DocumentFragment) {
        this._tweePrefixPostfixAddonJsCallback.afterPassage(text, passageTitle, passageObj, node);
        return;
    }

    beforeWikify(text: string) {
        this._tweePrefixPostfixAddonJsCallback.beforeWikify(text);
        return text;
    }

    afterWikify(text: string, node: DocumentFragment) {
        this._tweePrefixPostfixAddonJsCallback.afterWikify(text, node);
        return;
    }

    beforeWidget(text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) {
        this._tweePrefixPostfixAddonJsCallback.beforeWidget(text, widgetName, passageTitle, passageObj);
        return text;
    }

    afterWidget(text: string, widgetName: string, passageTitle: string | undefined, passageObj: SC2Passage | undefined, node: DocumentFragment) {
        this._tweePrefixPostfixAddonJsCallback.afterWidget(text, widgetName, passageTitle, passageObj, node);
        return;
    }
}
