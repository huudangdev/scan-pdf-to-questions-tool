const fs = require("fs");
const pdf = require("pdf-parse");
const nlp = require("compromise");

const path = "./pdf/su.pdf";

function render_page(pageData) {
  let render_options = {
    normalizeWhitespace: true,
    disableCombineTextItems: false
  };

  return pageData.getTextContent(render_options).then(function(textContent) {
    let lastY,
      text = "";
    for (let item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += "\n" + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  });
}

let options = {
  pagerender: render_page
};

let dataBuffer = fs.readFileSync(path);

const scanText = () => {
  pdf(dataBuffer, options).then(function(res) {
    handleText(res.text);
  });
};

const handleText = str => {
  const questionList = str.split(/Question|Câu[ ]/);

  questionList.map(text => {
    const content = text.split(/[A-Z][.][ ]/);
    console.log("Question:", content[0], "\n");
    content.slice(1).map((cont, index) => {
      console.log(`Answer ${String.fromCharCode(index + 65)}:`, cont);
    });
    console.log("\n");
  });
};

scanText(path);
