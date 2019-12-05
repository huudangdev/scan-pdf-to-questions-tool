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

var PDF_URL = "./pdf/su.pdf";
PDFJS.getDocument(PDF_URL).then(
  function(PDFDocumentInstance) {
    //var totalPages = PDFDocumentInstance.numPages;
    var pageNumber = 6;

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
  const questionList = str.split("Mark the letter A, B, C or D ");

  // console.log(questionList);

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
