// Initialize Firebase
var config = {
  apiKey: "AIzaSyCh-Af7irXVHtrIEqi7LzF21scPRNHYavk",
  authDomain: "train-ccfad.firebaseapp.com",
  databaseURL: "https://train-ccfad.firebaseio.com",
  projectId: "train-ccfad",
  storageBucket: "train-ccfad.appspot.com",
  messagingSenderId: "512231806700"
};
firebase.initializeApp(config);


//Ref input

var dataRef = firebase.database().ref('train');

/*  FORM IDs
    #train-name
    #destination
    #frequency
    #time 
    .btn
*/

var tBody = $('tbody')
$(".btn").on('click', function (e) {
  e.preventDefault();
  var trainName = $("#train-name").val()
  var destination = $(" #destination").val()
  var time = $("#time").val()
  var frequency = $("#frequency").val()
  if (frequency > 0 && trainName != '' && destination != '' && time != '') {
    tBody.empty()

    saveData(trainName, destination, frequency, time);
    document.getElementById('train-form').reset();
  }
  else {


    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

  }






});


function saveData(trainName, destination, frequency, time) {

  var user = dataRef.push()
  user.set({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    time: time,
  })

}

function dataRefOn() {
  
  
  dataRef.on('value', function (snapshot) {
    //console.log(snapshot.val());
    // console.log(snapshot.val());
    tBody.empty()
    
    snapshot.forEach(function (childSnapshot) {
      // var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      // console.log(childKey);
      //  console.log(childData);
      
      var firstTimeConverted = moment(childData.time, "HH:mm").subtract(1, "years");
      
      // Current Time
      // First Time (pushed back 1 year to make sure it comes before current time)
      var currentTime = moment();
      
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
     
      // Time apart (remainder)
      var tRemainder = diffTime % childData.frequency;
      
      // Minute Until Train
      var tMinutesTillTrain = childData.frequency - tRemainder;
      
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var aTime =moment(nextTrain).format("hh:mm");
      
      
      tableUpdate(childData.trainName, childData.destination, childData.frequency, tMinutesTillTrain, aTime)
      
    });
    
  });
  
}

function tableUpdate(trainName, destination, frequency, time, aTime) {

  
  
  
  // console.log('TABLE UPDATE FUNCTION', trainName, destination, frequency, time);
  
  var tBody = $('tbody')
  var row = $('<tr>')
  var td1 = $('<td>' + trainName + '</td>')
  var td2 = $('<td>' + destination + '</td>')
  var td3 = $('<td>' + frequency + '</td>')
  var td4 = $('<td>' +aTime + '</td>')
  var td5 = $('<td>' + time + '</td>')
  row.append(td1, td2, td3, td4, td5)
  tBody.append(row)
}


setInterval(dataRefOn, 45000)
dataRefOn()