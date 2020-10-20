declare module "dom-parser" {
  export interface DOMNode {
    nodeType: string;
    nodeName: string;
    childNodes: DOMNode;
    firstChild: DOMNode;
    lastChild: DOMNode;
    parentNode: DOMNode;
    attributes: Array<string>;
    innerHTML: string;
    outerHTML: string;
    textContent: string;
  }
  export interface Dom {
    (rawHTML: string): string;
    getElementsByClassName(className: string): DOMNode[];
    getElementsByTagName(tagName: string): DOMNode[];
    getELementById(id: string): DOMNode;
    getElementsByName(name: string): DOMNode[];
    getElementsByAttribute(attr: string, value: string): DOMNode[];
  }
  interface DomParserConstructor {
    new(): DomParserConstructor;
    parseFromString?(html: string): Dom;
  }
  const DomStuff: DomParserConstructor;
  export default DomStuff;
}