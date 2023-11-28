declare namespace css {
  function resolve(
    chunks: TemplateStringsArray,
    ...args: any[]
  ): {
    className: string
    styles: JSX.Element
  }
}


declare module 'styled-jsx/macro' {
        export = css

      }