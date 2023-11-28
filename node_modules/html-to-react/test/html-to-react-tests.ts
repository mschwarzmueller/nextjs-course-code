import { equal, strictEqual, deepStrictEqual, ok } from 'assert';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Parser } from '..';
import { ProcessNodeDefinitions } from '..';
import { booleanAttrs } from './boolattrs';

describe('Html2React', () => {
  const parser = Parser();

  describe('parse valid HTML', () => {
    it('should return a valid HTML string', () => {
      const htmlInput = '<p>Does this work?</p>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with nested elements', () => {
      const htmlInput = '<div><h1>Heading</h1></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with inline styles', () => {
      const htmlInput = '<div style="background-image:url(' +
        '&quot;http://lorempixel.com/400/200/&quot;);background-color:red;color:white;' +
        'font-family:&quot;Open Sans&quot;"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with inline image in style', () => {
      const htmlInput = '<div style="background:url(' +
        'data:image/png;base64,iVBORw0KGgoAAA);color:white;' +
        'font-family:&quot;Open Sans&quot;"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with empty inline styles', () => {
      const htmlInput = '<div style=""></div>';
      const htmlExpected = '<div></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should return a valid HTML string with custom properties in inline styles', () => {
      const htmlInput = '<div style="color:var(--color-example);--color-example:black"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with data attributes', () => {
      const htmlInput = '<div data-test-attribute="data attribute value"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with aria attributes', () => {
      const htmlInput = '<div aria-labelledby="label1"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with a class attribute', () => {
      const htmlInput = '<div class="class-one"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with a for attribute', () => {
      const htmlInput = '<label for="input"></label>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should return a valid HTML string with a react camelCase attribute', () => {
      const htmlInput = '<div contenteditable="true"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should handle dashed attributes', () => {
      const input = '<form accept-charset="en"><svg viewBox="0 0 10 10"><text text-anchor="left">' +
        '</text><circle stroke="black" stroke-width="42"></circle></svg></form>';
      const reactComponent = parser.parse(input);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, input);
    });

    // FIXME: See lib/process-node-definitions.js -> processDefaultNode()
    it.skip('should return a valid HTML string with comments', () => {
      const htmlInput = '<div><!-- This is a comment --></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    // FIXME: If / when React implements HTML comments, this test can be removed
    it('should return a valid HTML string without comments', () => {
      const htmlInput = '<div><!-- This is a comment --></div>';
      const htmlExpected = '<div></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should parse br elements without warnings', () => {
      const htmlInput = '<div><p>Line one<br>Line two<br/>Line three</p></div>';
      const htmlExpected = '<div><p>Line one<br/>Line two<br/>Line three</p></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should not generate children for br tags', () => {
      const htmlInput = '<br/>';

      const reactComponent = parser.parse(htmlInput);
      strictEqual((reactComponent.props.children || []).length, 0);
    });

    it('should parse void elements with all attributes and no warnings', () => {
      const htmlInput = '<p><img src="www.google.ca/logo.png"/></p>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    // Covers issue #9
    it('should parse textarea elements', () => {
      const htmlInput = '<textarea></textarea>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should generate keys for sequence items', () => {
      const htmlInput = '<ul><li>Item 1</li><li>Item 2</li><</ul>';

      const reactComponent = parser.parse(htmlInput);

      const children = reactComponent.props.children.flat().filter((c: any) => {
        return c.hasOwnProperty('key');
      });
      const keys = children.map((child: any) => {
        return child.key;
      });
      deepStrictEqual(keys, ['0', '1',]);
    });

    it('should parse br elements without warnings', () => {
      const htmlInput = '<div><p>Line one<br>Line two<br/>Line three</p></div>';
      const htmlExpected = '<div><p>Line one<br/>Line two<br/>Line three</p></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should parse src elements with all attributes but without warnings', () => {
      const htmlInput = '<p><img src="www.google.ca/logo.png"/></p>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should decode character entities in text nodes', () => {
      const htmlInput = '<div>1 &lt; 2</div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should not generate children for childless elements', () => {
      const htmlInput = '<div></div>';

      const reactComponent = parser.parse(htmlInput);

      strictEqual((reactComponent.props.children || []).length, 0);
    });

    it('should fill in the key name with boolean attribute', () => {
      const htmlInput = '<input type="checkbox" disabled required/>';
      const htmlExpected = '<input type="checkbox" disabled="" required=""/>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should decode attribute values to avoid React re-encoding them', () => {
      const htmlInput = '<p><a href="http://domain.com/search?query=1&amp;lang=en">A link</a></p>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlInput);
    });

    it('should handle spaces in inline styles', () => {
      const htmlInput = '<p style="text-align: center"></p>';

      const reactComponent = parser.parse(htmlInput);

      equal(reactComponent.props.style.textAlign, 'center');
    });

    it('should handle doctype directives', () => {
      const htmlInput = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" ' +
        '"http://www.w3.org/TR/REC-html40/loose.dtd"><html><body><div></div></body></html>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, '<html><body><div></div></body></html>');
    });

    it('should handle free text nodes', () => {
      const htmlInput = 'text<div></div>text';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, 'text<div></div>text');
    });

    it('should handle onclick attributes', function () {
      const htmlInput = `<button onclick="alert('hello!')">Hello</button>`;

      const reactElem = parser.parse(htmlInput);

      strictEqual(typeof reactElem.props.onClick, 'function');
      strictEqual(String(reactElem.props.onClick), String(Function(`alert('hello!')`)));
    });

    it('should handle inputs with empty value attribute', function () {
      const htmlInput = '<input value="">';

      const reactElem = parser.parse(htmlInput);

      strictEqual(reactElem.props.value, '');
    });

    it('should handle boolean attributes with implicit value', function () {
      booleanAttrs.forEach((attr) => {
        const htmlInput = `<input ${attr.toLowerCase()}>`;

        const reactElem = parser.parse(htmlInput);

        strictEqual(reactElem.props[attr], attr);
      });
    });
  });

  describe('parse invalid HTML', () => {
    it('should fix missing closing tags', () => {
      const htmlInput = '<div><p></div>';
      const htmlExpected = '<div><p></p></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });

    it('should handle invalid style tag', () => {
      const htmlInput = '<div style="color:black;href="></div>';
      const htmlExpected = '<div style="color:black"></div>';

      const reactComponent = parser.parse(htmlInput);
      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

      equal(reactHtml, htmlExpected);
    });
  });

  describe('with custom processing instructions', () => {
    const parser = Parser();
    const processNodeDefinitions = ProcessNodeDefinitions();

    describe('parse valid HTML', () => {
      it('should return nothing with only a single <p> element', () => {
        const htmlInput = '<p>Does this work?</p>';
        const isValidNode = () => {
          return true;
        };
        const processingInstructions = [{
          shouldProcessNode: (node: any) => {
            return node.name && node.name !== 'p';
          },
          processNode: processNodeDefinitions.processDefaultNode,
        },];
        const reactComponent = parser.parseWithInstructions(htmlInput, isValidNode,
          processingInstructions);

        // With only 1 <p> element, nothing is rendered
        equal(reactComponent, false);
      });

      it('should return a single <h1> element within a div of <h1> and <p> as siblings',
        () => {
          const htmlInput = '<div><h1>Title</h1><p>Paragraph</p></div>';
          const htmlExpected = '<div><h1>Title</h1></div>';

          const isValidNode = () => {
            return true;
          };

          const processingInstructions = [{
            shouldProcessNode: (node: any) => {
              return node.type === 'text' || node.name !== 'p';
            },
            processNode: processNodeDefinitions.processDefaultNode,
          },];
          const reactComponent = parser.parseWithInstructions(htmlInput, isValidNode,
            processingInstructions);
          const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
          equal(reactHtml, htmlExpected);
        });

      it('should replace the children of an element if configured so', () => {
        const htmlInput = '<div><div data-test="foo"><p>Text</p><p>Text</p></div></div>';
        const htmlExpected = '<div><div data-test="foo"><h1>Heading</h1></div></div>';

        const isValidNode = () => {
          return true;
        };

        const processingInstructions = [
          {
            replaceChildren: true,
            shouldProcessNode: (node: any) => {
              return (node.attribs || {})['data-test'] === 'foo';
            },
            processNode: (node: any, children: any, index: number) => {
              return React.createElement('h1', { key: index, }, 'Heading');
            },
          },
          {
            // Anything else
            shouldProcessNode: (node: any) => {
              return true;
            },
            processNode: processNodeDefinitions.processDefaultNode,
          },
        ];

        const reactComponent = parser.parseWithInstructions(htmlInput, isValidNode,
          processingInstructions);
        const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
        equal(reactHtml, htmlExpected);
      });

      it('should return capitalized content for all <h1> elements', () => {
        const htmlInput = '<div><h1>Title</h1><p>Paragraph</p>' +
          '<h1>Another title</h1></div>';
        const htmlExpected = '<div><h1>TITLE</h1><p>Paragraph</p>' +
          '<h1>ANOTHER TITLE</h1></div>';

        const isValidNode = () => {
          return true;
        };

        const processingInstructions = [
          {
            // Custom <h1> processing
            shouldProcessNode: (node: any) => {
              return node.parent && node.parent.name &&
                node.parent.name === 'h1';
            },
            processNode: (node: any, children: any) => {
              return node.data.toUpperCase();
            },
          }, {
            // Anything else
            shouldProcessNode: (node: any) => {
              return true;
            },
            processNode: processNodeDefinitions.processDefaultNode,
          },
        ];
        const reactComponent = parser.parseWithInstructions(htmlInput, isValidNode,
          processingInstructions);
        const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
        equal(reactHtml, htmlExpected);
      });

      it('should return false in case of invalid node', () => {
        const htmlInput = '<p></p>';
        const processingInstructions = [{
          shouldProcessNode: (node: any) => { return true; },
          processNode: processNodeDefinitions.processDefaultNode,
        },];
        const reactComponent = parser.parseWithInstructions(htmlInput,
          () => { return false; }, processingInstructions);

        equal(reactComponent, false);
      });

      it('should generate only valid children', () => {
        const htmlInput = '<div> <p></p> <p></p> </div>';

        const processingInstructions = [{
          shouldProcessNode: (node: any) => { return true; },
          processNode: processNodeDefinitions.processDefaultNode,
        },];
        const reactComponent = parser.parseWithInstructions(htmlInput, (node: any) => {
          // skip whitespace text nodes to clean up children
          if (node.type === 'text') {
            return node.data.trim() !== '';
          }
          return true;
        }, processingInstructions);

        equal(reactComponent.props.children.length, 2);
      });

      it('should not affect unhandled whitespace', () => {
        const htmlInput = '<div> <p></p> <p></p> </div>';

        const reactComponent = parser.parse(htmlInput);

        equal(reactComponent.props.children.length, 5);
      });
    });

    it('should support preprocessing instructions', function () {
      const htmlInput = '<div>' +
        '<div id="first" data-process="shared"><p>Sample For First</p></div>' +
        '<div id="second" data-process="shared"><p>Sample For Second</p></div>' +
        '</div>';
      const htmlExpected = '<div><h1 id="preprocessed-first">First</h1>' +
        '<h2 id="preprocessed-second">Second</h2></div>';

      const isValidNode = function () {
        return true;
      };
      // We have two preprocessing instructions; the first sets the attribute data-preprocessed,
      // and the second one changes the ID of nodes that have the data-preprocessed attribute
      // (i.e., it will only affect nodes touched by the previous preprocessor).
      const preprocessingInstructions = [
        {
          shouldPreprocessNode: (node: any) => {
            return (node.attribs || {})['data-process'] === 'shared';
          },
          preprocessNode: (node: any) => {
            if (node.attribs == null) {
              node.attribs = {};
            }
            node.attribs['data-preprocessed'] = 'true';
          },
        },
        {
          shouldPreprocessNode: (node: any) => {
            return (node.attribs || {})['data-preprocessed'] === 'true';
          },
          preprocessNode: (node: any) => {
            node.attribs.id = `preprocessed-${node.attribs.id}`;
          },
        },
      ];
      const processingInstructions = [
        {
          shouldProcessNode: (node: any) => {
            return (node.attribs || {}).id === 'preprocessed-first';
          },
          processNode: (node: any, children: any, index: number) => {
            return React.createElement('h1', {
              key: index,
              id: node.attribs.id,
            }, 'First');
          },
        },
        {
          shouldProcessNode: (node: any) => {
            return (node.attribs || {}).id === 'preprocessed-second';
          },
          processNode: (node: any, children: any, index: number) => {
            return React.createElement('h2', {
              key: index,
              id: node.attribs.id,
            }, 'Second');
          },
        },
        {
          shouldProcessNode: function () {
            return true;
          },
          processNode: processNodeDefinitions.processDefaultNode,
        },
      ];
      const reactComponent = parser.parseWithInstructions(htmlInput, isValidNode,
        processingInstructions, preprocessingInstructions);

      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
      strictEqual(reactHtml, htmlExpected);
    });
  });

  describe('parse SVG', () => {
    it('should have correct attributes', () => {
      const input2RegExp = {
        '<svg><image xlink:href="http://i.imgur.com/w7GCRPb.png"/></svg>':
          /<svg><image xlink:href="http:\/\/i\.imgur\.com\/w7GCRPb\.png"/,
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>':
          // eslint-disable-next-line max-len
          /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"><\/svg>/,
      };
      Object.entries(input2RegExp).forEach(([input, regExp,]) => {
        const reactComponent = parser.parse(input);
        const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

        ok(regExp.test(reactHtml), reactHtml + ' has expected attributes');
      });
    });
  });

  describe('parsing multiple elements', () => {
    it('should result in a list of React elements', () => {
      const htmlInput = '<div></div><div></div>';
      const elements = parser.parse(htmlInput);
      const output = elements.map(ReactDOMServer.renderToStaticMarkup).join('');
      equal(htmlInput, output);
    });
  });

  describe('parsing custom elements', () => {
    it('should not change class attribute to classname', () => {
      const htmlInput = '<custom-element class="class-one"></custom-element><custom-element-2 class="class-two"></custom-element-2>';
      const elements = parser.parse(htmlInput);
      const output = elements.map(ReactDOMServer.renderToStaticMarkup).join('');
      equal(htmlInput, output);
    });
  });
});
