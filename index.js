const PDFJS = require("pdfjs-dist");
const nlp = require("compromise");

function getPageText(pageNum, PDFDocumentInstance) {
  // Return a Promise that is solved once the text of the page is retrieven
  return new Promise(function(resolve, reject) {
    PDFDocumentInstance.getPage(pageNum).then(function(pdfPage) {
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function(textContent) {
        var textItems = textContent.items;
        var finalString = "";

        // Concatenate the string of the item to the final string
        for (var i = 0; i < textItems.length; i++) {
          var item = textItems[i];

          finalString += item.str + " ";
        }

        // Solve promise with the text retrieven from the page
        resolve(finalString);
      });
    });
  });
}

/**
 * Extract the test from the PDF
 */

var PDF_URL = "./pdf/tienganh.pdf";
PDFJS.getDocument(PDF_URL).then(
  function(PDFDocumentInstance) {
    //var totalPages = PDFDocumentInstance.numPages;
    var pageNumber = 1;

    // Extract the text
    getPageText(pageNumber, PDFDocumentInstance).then(function(textPage) {
      // Show the text of the page in the console
      //console.log(textPage);
      handleText(textPage);
    });
  },
  function(reason) {
    // PDF loading error
    console.error(reason);
  }
);

const handleText = str => {
  
  const questionList = str.split(/(?:Question[ ]?|Câu[ ]?)(?:[0-9]+)[.|:][ ]/);

  let s = "";

  console.log(questionList)

  questionList.map((text, index) => {
    const mark = text.match(/(Mark the letter A, B, C or D(.*))/)
    // console.log('mark', index, Array.isArray(mark) && mark[0])
    const content = text.split(/[A-Z][.][ ]/);
    console.log("Question", index, content[0], "\n");
    s += "Question" + ' ' + index + ':' + content[0] + "\n";
    content.slice(1).map((cont, index) => {
      console.log(`Answer ${String.fromCharCode(index + 65)}:`, cont);
      s += `Answer ${String.fromCharCode(index + 65)}:` + cont;
    });
    console.log("\n");
    s += "\n";
  });
  // fs.writeFileSync("./data.json", s);
};
