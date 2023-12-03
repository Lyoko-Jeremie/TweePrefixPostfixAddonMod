
# TweePrefixPostfixAddon

---


---

js api:

```typescript
window.addonTweePrefixPostfixAddon.addCallback(
    'YourModCallbackName',
    {},  // the TweePrefixPostfixAddonCallback object
)
```

```typescript
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
```
