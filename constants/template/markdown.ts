// @ts-expect-error
import syntaxStyles from '!!raw-loader!highlight.js/styles/a11y-dark.css' // eslint-disable-line import/no-unresolved
export const css = `
  /* highlight.js theme: a11y-dark.css */
  ${syntaxStyles}
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 24px 0 8px;
  }
  pre {
    margin: 8px 0;
  }
  code {
    background: #666;
    display: block;
  }
  table {
    border-collapse: collapse;
  }
  th {
    background: #999;
  }
  td {
    background: #eee;
  }
  th,
  td {
    border: 1px solid #fff;
    padding: 4px 8px;
  }
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  a:link,
  a:visited {
    color: #16f;
  }
  img {
    max-width: 100%;
  }
`

export const markdown = `
# H1 heading
## H2 heading
### H3 heading
#### H4 heading
##### H5 heading

|aaa|bbb|
|--|--|
|CCC|DDD|

\`\`\`js
// Javascript
console.log('OK')
\`\`\`

\`\`\`css
/* OK */
.ok {
    color: #000;
}
\`\`\`

~strike~
`
