// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const title = $("<h1>").prependTo("body").text("Jeopardy!");
const btn = title.after(
  $("<button>")
    .text("Start!")
    .on("click", function () {
      getCategory();
    })
);
const table = $("<table>");
const categoriesRow = $("<thead>").append($("<tr>").text("Test"));
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  const response = await axios.get("https://jservice.io/api/random", {
    params: { count: 100 },
  });
  let categories = response.data.map((id) => id.id);
  return _.sampleSize(categories, 6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  const response = await axios.get("https://jservice.io/api/category", {
    params: { id: 4333 },
  });
  console.log(response);
  let ids = _.sampleSize(response.data, 6);
  let clues = ids.map((clue) => ({
    title: clue.category.title,
    question: clue.question,
    answer: clue.answer,
    showing: null,
  }));
  console.log(clues);
}
/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  const catIds = await getCategoryIds();

  categories = [];

  for (let catId of catIds) {
    categories.push(await getCategory(catId));
  }
  fillTable();
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
