var API_KEY='YOURKEY';
var LIST_ID = 'YOURID';
var c = '&count=1000'; //defaults to 10 unless you specify
var root = 'YOUR MAILCHIMP API URL';
var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
    'Authorization': 'apikey ' + API_KEY
    }
};

function mailchimpBounceAlerts() {

/**********************************************************************
Getting interest categories to compare against later
***********************************************************************/
 var endpoint1 = 'lists/' + LIST_ID + '/interest-categories/CATEGORY/interests?fields=interests.id,interests.name,';
 var response1 = UrlFetchApp.fetch(root+endpoint1, params);
 var data1 = response1.getContentText();
 var json1 = JSON.parse(data1);
    
/**********************************************************************
Getting users who have bounced
***********************************************************************/
 //date range of endpoint request
 var d = new Date();
 d.setDate(d.getDate() - 1); 
  
 var endpoint2 = 'lists/' + LIST_ID + '/members?status=cleaned&since_timestamp_opt=' +d.toISOString()+ '&fields=members.timestamp_opt,members.email_address,members.interests,members.merge_fields'+ c;
  
 var response2 = UrlFetchApp.fetch(root+endpoint2, params);
 var data2 = response2.getContentText();
 var json2 = JSON.parse(data2);
  
/**********************************************************************
Comparing users' interests to the list from interests in specified section
***********************************************************************/  
  var emailContents = [];
  var interestsLength = json1.interests.length

for(y=0; y<json2.members.length;y++) { //Looping based on number of people who bounced
  for(z=0;z<interestsLength;z++){ //Looping based on length of interests & searching for interests in that array with value of true
    var currentInterest = json1.interests[z].id;
    var memberInterest = json2.members[y].interests[currentInterest];
    if (memberInterest === true) {
      emailContents.push(json2.members[y].email_address + " bounced at " + json1.interests[z].name)
    }
  }
}

if (emailContents.length > 0) {
  MailApp.sendEmail({
    to: "EMAIL ADDRESS",
    subject: "Bounced emails",
    htmlBody: emailContents.join(". <br>")
  })
}
}
