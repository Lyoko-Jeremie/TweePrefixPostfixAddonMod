
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
     * @return new passage inner text give the next callback OR as the final result to the wikify
     */
    beforePassage?: (text: string, passageTitle: string, passageObj: SC2Passage) => string;
    afterPassage?: (text: string, passageTitle: string, passageObj: SC2Passage, node: DocumentFragment) => void;
    /**
     * return new wikify text
     * @param text
     * @return new wikify text give the next callback OR as the final result to the wikify
     */
    beforeWikify?: (text: string) => string;
    afterWikify?: (text: string, node: DocumentFragment) => void;
    /**
     * return new widget text
     * @param text
     * @param widgetName
     * @param passageTitle
     * @param passageObj
     * @return new widget inner text give the next callback OR as the final result to the wikify
     */
    beforeWidget?: (text: string, widgetName: string, passageTitle?: string, passageObj?: SC2Passage) => string;
    afterWidget?: (text: string, widgetName: string, passageTitle: string | undefined, passageObj: SC2Passage | undefined, node: DocumentFragment) => void;
}
```
