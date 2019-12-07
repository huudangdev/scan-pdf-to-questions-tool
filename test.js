const fs = require("fs");
const pdf = require("pdf-parse");
const nlp = require("compromise");

const path = "./pdf/test.pdf";

function render_page(pageData) {
  let render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: true
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
  const questionList = str.split("Mark the letter A, B, C or D ");
  let s = "";
  questionList.map((text, index) => {
    const group = text.split(/Question[ ]|Câu[ ]/);
    group.slice(1).map((cont, index) => {
      const content = cont.split(/[A-D][.][ ]/);
      s += `Question: ${content[0].replace(/\n/g, "")}\n`;
      content.slice(1).map((ans, index) => {
        if (index != content.length - 2) {
          s +=
            `Answer ${String.fromCharCode(index + 65)}: ` +
            ans.replace(/\n/g, "") +
            "\n";
        } else {
          const hint = ans.split("Hướng dẫn giải");
          s +=
            `Answer ${String.fromCharCode(index + 65)}: ` +
            hint[0].replace(/\n/g, "") +
            "\n";
          if (hint[1])
            s += `Hint: ${hint[1].replace(/\n/g, "")} \n`;
        }
      });
    });
  });
  fs.writeFileSync("./data.txt", s);
};

scanText(path);
