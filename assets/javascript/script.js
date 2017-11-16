// Initialize Firebase
var config = {
    apiKey: "AIzaSyCJp7uFgNrDbZ4Ec0YLlKuMzXiUDYjfFew",
    authDomain: "train-schedule-95712.firebaseapp.com",
    databaseURL: "https://train-schedule-95712.firebaseio.com",
    projectId: "train-schedule-95712",
    storageBucket: "",
    messagingSenderId: "763379787614"
};

firebase.initializeApp(config);

var database = firebase.database();

console.log("script.js connected");

$("#addSchedule").on("click", function(event) {

    event.preventDefault();

    console.log("button works");

    var inputTrainName = $("#trainName").val();
    var inputDestination = $("#destination").val();
    var inputFirstTrainTime = $("#firstTrainTime").val();
    var inputFrequency = $("#frequency").val();

    console.log(inputTrainName);
    console.log(inputDestination);
    console.log(inputFirstTrainTime);
    console.log(inputFrequency);

    //store new train as a local temporary object with these four vars.
    //will need to save this object to the database as opposed to calculating
    //the next two vars and then saving -- these vars will stay the same,
    //whereas the next two will change based on the time of day

    var newTrain = {
        name: inputTrainName,
        dest: inputDestination,
        time: inputFirstTrainTime,
        freq: inputFrequency
    };

    database.ref().push(newTrain);

    alert("train successfully added");

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    var inputTrainName = childSnapshot.val().name;
    var inputDestination = childSnapshot.val().dest;
    var inputFirstTrainTime = childSnapshot.val().time;
    var inputFrequency = childSnapshot.val().freq;

    console.log(inputTrainName);
    console.log(inputDestination);
    console.log(inputFirstTrainTime);
    console.log(inputFrequency);

    ///calculate next arrival time and minutes until next arrival

    var frequency = inputFrequency;
    var firstTime = inputFirstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var remainder = diffTime % frequency;
    console.log(remainder);

    // Minute Until Train
    var durationMinutes = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + durationMinutes);

    // Next Train
    var nextTrain = moment().add(durationMinutes, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    $("#scheduleTable > tbody").append("<tr><td>" + inputTrainName + "</td><td>" + inputDestination + "</td><td>" +
        inputFrequency + "</td><td>" + nextTrain + "</td><td>" + durationMinutes + "</td></tr>");

});
