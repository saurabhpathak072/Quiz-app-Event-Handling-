 $(document).ready(function() {

var results = [];
var selectedAnswers = {};


var usernameInput = $("#username");
var modal =$("#modal-container");
// var quiz = $("#quiz-container");

var submit =$("#submit");
var reset =$("#reset");
var button =$(".buttons");

 var URL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple";

   // On clicking the quiz answer, run this function
   function onAnswerClick(e) {
    e.stopPropagation();

    var answerEl = $(e.target);
    var index = answerEl
      .parent()
      .parent()
      .attr("data-index");
    var answer = answerEl.text();
    var isCorrect = results[index].correct_answer === answer;

    selectedAnswers[index] = { answer: answer, isCorrect: isCorrect };

    answerEl
      .addClass("active-answer")
      .siblings()
      .removeClass("active-answer");
  }

//render quiz from retrived quiz data
 function  renderQuiz(response){
    
    // console.log(">>",response);
    console.log("1",response.results);
    if(response.results.length){
        results = [].concat(response.results);
        //results = [].concat(response.results);
        console.log("2",results);

        //loop through the results receive from the response and render quiz questions
        results.forEach( function(quizQ,index) {
            var answers = [quizQ.correct_answer]
                .concat(quizQ.incorrect_answers)
                .sort(()=> Math.random()-0.5);

            var answerList = $('<ul class="answers-list"></ul>');

            //loop through the array of answer and render it
            answers.forEach(function(answer){

                answerList.append('<li class="answer">'+answer+"</li>");
            }); 
            
            var quiz = $("#quiz-container");
                
            //loop through results and render question and answer
             quiz.append(
                '<li class="quiz-block" data-index="' +
                index +
                '" id=question-' +
                index +
                '><h4 class="question">' +
                (index + 1) +
                ". " +
                quizQ.question +
                "</h4></li>"
            ); 
            $("#question-" + index + "").append(answerList);
        });
        
        $(".answer").on("click", onAnswerClick);
        button.css("display", "flex");
    }
}

function fetchData(){
    fetch(URL)
        .then((response) => response.json())
        .then((data) => renderQuiz(data))
}


 function getUsername(e){
     if (e.key === "Enter" || e.keyCode === 13 || e.which === 13){
         if(usernameInput.val()){
             username = usernameInput.val();
             toggleUsernameModal();

             fetchData();
         }
     }
 }

 // Toggle username modal based on requirement
 function toggleUsernameModal() {
    if (modal.hasClass("out")) {
      modal.removeClass("out");
    } else {
      modal.addClass("out");
    }
  }

  // On submitting quiz answers, run this function
  function onSubmit(e) {
    e.preventDefault();

    var rightAnswersCount = 0;

    if (Object.keys(selectedAnswers).length === results.length) {
      rightAnswersCount = Object.values(selectedAnswers).filter(
        answer => answer.isCorrect
      ).length;
      var quiz = $("#quiz-container");
      quiz.html(
        "<li>" +
          username +
          ", you have answered " +
          rightAnswersCount +
          " questions correctly.</li>"
      );
    } else {
      alert("Please answer all questions");
    }
  }

 //Bind Event
 usernameInput.on("keypress",getUsername);
 submit.on("click",onSubmit);
  reset.on("click", function() {
      location.reload();
  });


});


