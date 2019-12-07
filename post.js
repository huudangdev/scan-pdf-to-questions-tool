const fs = require("fs");
const pdf = require("pdf-parse");
const axios = require("axios");
const uuidv1 = require("uuid/v1");

const path = "./pdf/test.pdf";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZTBkY2Q2MDA4NTVkM2JlZjVmMTcyMiIsImlhdCI6MTU3NTAxNzY4NiwiZXhwIjoxNTc3NjA5Njg2fQ.yLee7Hmvhu27MBRB9d456ZAu_-YwUUV9xpQ-9cBzm0A";

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

  questionList.map((text, index) => {
    const group = text.split(/Question[ ]|Câu[ ]/);
    group.slice(1).map(cont => {
      const newQuestion = {
        questionType: "Single",
        isRequired: false,
        publishedBy: {
          username: "dang",
          fullname: "decoding",
          avatar: {}
        },
        owner: {
          username: "dang",
          fullname: "decoding",
          avatar: {}
        },
        status: "NEED_REVIEW",
        passage: {},
        questionId: uuidv1(),
        questionLinked: false,
        questionLinkedIds: [],
        questionLinkedLength: 0,
        question: {
          content: ""
        },
        type: "MUL_CHOICE",
        level: 1,
        answers: [],
        hasHint: true,
        hint: {
          content: ""
        },
        hasSolution: false,
        solution: {},
        category: "5dd3e7660dd6b8000c034152",
        subject: "5dd3ea9e0dd6b8000c034155",
        chapter: "5dd3f7541512e000226a6402",
        topic: "5dd3f9cb1512e000226a640c"
      };
      const content = cont.split(/[A-D][.][ ]/);
      newQuestion.question.content = content[0].replace(/\n/g, "");
      content.slice(1).map((ans, index) => {
        const newAnswer = {};
        if (index != content.length - 2) {
          newAnswer.selectAnswer = String.fromCharCode(index + 65);
          newAnswer.blanks = ans.replace(/\n/g, "");
          newQuestion.answers.push(newAnswer);
        } else {
          const hint = ans.split("Hướng dẫn giải");
          newAnswer.selectAnswer = String.fromCharCode(index + 65);
          newAnswer.blanks = hint[0].replace(/\n/g, "");
          newQuestion.answers.push(newAnswer);
          if (hint[1]) {
            (newQuestion.hasHint = true),
              (newQuestion.hint = hint[1].replace(/\n/g, ""));
          }
        }
      });
      //console.log(newQuestion);
      outQuestion(newQuestion, token);
    });
  });
};

const outQuestion = (question, token) => {
  axios
    .post("http://localhost:1400/questions", question, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(status => console.log(status))
    .catch(err => console.error(err));

  axios.post();
};

scanText(path);
