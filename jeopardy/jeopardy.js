// categories is the main data structure for the app; it looks like this:
const $table = $("<table>").addClass("table");
let $title = $("<h1>").text("Jeopardy!");
let categories = [];
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
    params: { id: catId },
  });
  console.log(response);
  const title = response.data.title;
  console.log(title);
  const clues = response.data.clues;
  let clueArray = clues.map((clue) => ({
    question: clue.question,
    answer: clue.answer,
    showing: null,
  }));
  console.log({ title, clueArray });
  return { title, clueArray };
}
/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (intially, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  $(".table").empty();
  $("td").empty();
  $("th").empty();
  $("tr").empty();
  const $thead = $("<thead>");
  const $tbody = $("<tbody>");
  const $tr = $("<tr>");
  $("div").append($table);
  $table.append($thead);
  $thead.after($tbody);
  $thead.append($tr);

  for (let idx = 0; idx < 6; idx++) {
    const $th = $("<th>").text(
      JSON.stringify(categories[idx].title).toUpperCase()
    );
    $tr.append($th);
  }
  for (let idx1 = 0; idx1 < 5; idx1++) {
    const $tr = $("<tr>");
    $tbody.append($tr);
    for (let idx2 = 0; idx2 < 6; idx2++) {
      const $td = $("<td>").attr("id", `${idx2}-${idx1}`).text("?");
      $td.click(handleClick);
      $tr.append($td);
    }
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let id = evt.target.id;
  let [catId, clueId] = id.split("-");
  let clue = categories[catId].clueArray[clueId];
  if ($(`#${catId}-${clueId}`).text() === "?") {
    $(`#${catId}-${clueId}`).text(clue.question);
  } else if ($(`#${catId}-${clueId}`).text() === clue.question) {
    $(`#${catId}-${clueId}`).text(clue.answer);
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

/** Remove the loading spinner and update the button used to fetch data. */
$("body").prepend(
  $("<div>")
    .prepend($title)
    .append(
      $("<button>")
        .text("Start/Restart")
        .on("click", function () {
          return setupAndStart();
        })
    )
);
/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * - if err start-over
 * */

async function setupAndStart() {
  //spinner from loading.io
  let spinner = $(
    "<div class='lds-ring'><div></div><div></div><div></div><div></div></div>"
  );
  $("table").empty();
  $("table").append(spinner);
  try {
    const catIds = await getCategoryIds();
    categories = [];
    for (let catId of catIds) {
      categories.push(await getCategory(catId));
    }
    fillTable();
  } catch (err) {
    setupAndStart();
  }
}
