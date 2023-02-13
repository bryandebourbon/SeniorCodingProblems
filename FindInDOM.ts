/**
Problem Statement:

You are given a simplified representation of an HTML DOM tree as an object with properties for the element name, text content, and child mockHTMLNodes. Write a function find(mockHTMLNode, target) that takes a mockHTMLNode object and a target string as input, and returns an array of mockHTMLNode objects that contain contiguous blocks of text that match the target string.

For example, given the following input:

const root = {
  element: "span",
  children: [
    {
      element: "b",
      textContent: "This",
    },
    {
      element: "b",
      children: [
        {
          element: "u",
          textContent: "very cool stuff",
        },
      ],
    },
    {
      element: "",
      textContent: "is very",
    },
    {
      element: "i",
      textContent: "funny",
    },
  ],
};

The call find(root, "very funny") should return the array 
[{ element: "", textContent: "is very" },
 { element: "i", textContent: "funny" }]  which are the two mockHTMLNodes that contain the contiguous block of text "very funny".

 */

////////// Solution //////////

/**
There Exists Three Cases we will come across parsing the DOM tree

Cases:
(0) none of target is in leaf.innerText: 'abcdefgh'
    => return []
 
(1) all of target is in leaf.innerText: 'abcd target efgh'
    => return leaf

(2) part of target is in leaf.innerText: ('get abcd' + 'tar abcd' + 'abcd get' + 'abcd tar')
    a. startTrackingTarget: leaf has start of target: ('abcd tar')
    b. continueTrackingTarget: leaf has middle of target: ('rge')
    c. continueTrackingTarget: leaf starts with end of target: ('get abcd')
    d. false positives: ('tar abcd' + 'abcd get')

These cases are addressed below:
 */
type mockHTMLNode = {
  textContent: string;
  children: mockHTMLNode[];
};

function findInDOM(root: mockHTMLNode, target: string): mockHTMLNode[] {
  let targetSoFar = "";
  let resultSoFar: mockHTMLNode[] = [];

  function startTrackingTarget(leaf: mockHTMLNode): [mockHTMLNode[], string] {
    const text = leaf.textContent;
    const index = text.indexOf(target[0]);

    if (index !== -1) {
      const restOfTarget = target.slice(1);
      const subset = text.slice(index);

      if (subset.includes(restOfTarget)) {
        targetSoFar = target.slice(index);
        resultSoFar = [leaf];
        return [resultSoFar, targetSoFar];
      }
    }

    return [[], ""];
  }

  function continueTrackingTarget(
    restOfTarget: string
  ): [mockHTMLNode[], string] {
    if (restOfTarget === targetSoFar) {
      return [resultSoFar, targetSoFar];
    }

    for (let i = 0; i < restOfTarget.length; i++) {
      if (targetSoFar[i] !== restOfTarget[i]) {
        targetSoFar = "";
        resultSoFar = [];
        return [[], ""];
      }
    }

    targetSoFar += restOfTarget.slice(targetSoFar.length);

    if (targetSoFar === target) {
      return [resultSoFar, targetSoFar];
    }

    return [[], ""];
  }

  function forEachLeaf(
    mockHTMLNode: mockHTMLNode,
    callback: (mockHTMLNode: mockHTMLNode) => void
  ) {
    if (mockHTMLNode.children.length === 0) {
      callback(mockHTMLNode);
    } else {
      for (let child of mockHTMLNode.children) {
        forEachLeaf(child, callback);
      }
    }
  }

  forEachLeaf(root, (leaf: mockHTMLNode) => {
    if (leaf.textContent.includes(target)) {
      return [leaf];
    }

    if (target === targetSoFar) {
      return resultSoFar;
    }

    if (!targetSoFar) {
      [resultSoFar, targetSoFar] = startTrackingTarget(leaf);
    } else {
      const restOfTarget = target.slice(targetSoFar.length);
      [resultSoFar, targetSoFar] = continueTrackingTarget(restOfTarget);

      if (!targetSoFar) {
        [resultSoFar, targetSoFar] = startTrackingTarget(leaf);
      }
    }
  });

  return resultSoFar;
}
