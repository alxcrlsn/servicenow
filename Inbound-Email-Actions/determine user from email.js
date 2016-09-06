// Condition: js:gs.getUserID() === "sys_id of email processing/catchall user";


var emfrom = email.headers;                                  //Grab full header for parsing to identify From and attempt unique S-Now user match
var emnum = emfrom.lastIndexOf('From:'); //Grab last occurance of "From:" in header to parse name
current.caller_id.setDisplayValue('guest');       //Set this as default, just in case nothing else matches - 'guest' is the user name for 'Email Processing'
var sdescript = "ORPHAN INCIDENT:  Unknown";                 //Set this as default to let us know it passed through without reset
if (emnum > -1) {
   emfrom=emfrom.substr(emnum,80);                            //take from the "From:" to end of the string
   emnum = emfrom.indexOf("<");
   if (emnum > -1) {                                          //grabbing "Fname Lname<email@email.com>" to parse out first name and last name
	  emfrom=emfrom.substr(5,emnum-5);
	  emnum = emfrom.indexOf(" ");
	  emfrom_fname = emfrom.substr(0,emnum);
	  emfrom_lname = emfrom.substr(emnum+1,40);
	  emfrom_fname = emfrom_fname.toString().trim();
	  emfrom_lname = emfrom_lname.toString().trim();
	  var target = new GlideRecord('sys_user');
	  target.addQuery('first_name',emfrom_fname);
	  target.addQuery('last_name',emfrom_lname);
	  target.query();
	  if (target.getRowCount()==1) {                           //Only execute this section if unique (1 return) user is identified
         while (target.next()) {
			var ourUser = target.user_name;
	     }
		 current.caller_id.setDisplayValue(ourUser);           //set Client to identified user value
	     current.work_notes = "Received from alternate email.\nDU ID identified: " + ourUser + "  Full Name: " + current.caller_id.getDisplayValue();
		 sdescript = email.subject;
	  }
	  else {
		 emfrom += " Unidentified User\n";
		 current.work_notes = "No Service Now User Identified with this information: " + emfrom + " " + email.origemail + "\n";
		 sdescript = "ORPHAN INCIDENT: " + email.subject;
	  }
   }
}
current.comments = "received from: " + emfrom + "\n";
current.comments+= "from email: " + email.origemail + "\n\n" + email.body_text + "\n";
current.short_description = sdescript;

current.insert();

event.state='stop_processing';
