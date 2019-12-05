const fs = require("fs");
const pdf = require("pdf-parse");
const nlp = require("compromise");

const path = "./pdf/tienganh.pdf";

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

// const handleText = str => {
//   const questionList = str.split(/Question|Câu[ ]\d{1,3}[.|:]/);
//   let s = "";

//   questionList.map((text, index) => {
//     const content = text.split(/[A-Z][.][ ]/);
//     console.log("Question", index, content[0], "\n");
//     s += "Question" + ' ' + index + ':' + content[0] + "\n";
//     content.slice(1).map((cont, index) => {
//       console.log(`Answer ${String.fromCharCode(index + 65)}:`, cont);
//       s += `Answer ${String.fromCharCode(index + 65)}:` + cont;
//     });
//     console.log("\n");
//     s += "\n";
//   });
//   fs.writeFileSync("./data.json", s);
// };

const handleText = str => {
  const questionList = str.split("Mark the letter A, B, C or D ");

  questionList.map((text, index) => {
    const group = text.split(/(?:Question[ ]|Câu[ ])/);
    console.log(
      "Type: Mark the letter A, B, C or D ",
      group[0].normalize("NFKD"),
      "\n"
    );
    group.slice(1).map((cont, index) => {
      const content = cont.split(/[A-Z][.][ ]/);
      console.log(`Question: ${content[0].normalize("NFKD")}`);
      content.slice(1).map((ans, index) => {
        console.log(
          `Answer ${String.fromCharCode(index + 65)}:`,
          ans.normalize("NFKD")
        );
      });
    });
    console.log("\n");
  });
};

scanText(path);
