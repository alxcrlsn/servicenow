/*
This uses a catalog UI policy to hide nonessential fields by default.
Once a selection is made in the form, the appropriate fields will appear.
This also uses three client scripts: 
The first hides unnecessary fields (onChange) if a voicemail deletion is requested.
The second attempts autofill info into the personal information fields if possible.
The third changes the value of "none" in the action select box to "please select"
The client scripts I wrote are commented, so check there for a description of how they work.
The UI policy is not commented because it was created using a GUI. 
The UI policy runs on a condition (default value of actionSelect)
When the UI policy runs, it has 4 actions that hide fields.
The fields are re-enabled by the client script when needed.

UI Policy is called: "Hide variables until selection is made"
Client script 1 is called: "Show/hide fields depending on selection"
Client script 2 is called: "Attempt to autopopulate user info"
Client script 3 is called: "Change -- None -- value"

In the UI policy, you'll see references to "-- None --" or "none" 
even though it now says "-- Please Select --" That's because outside
of client script 3, ServiceNow still think's it's "-- None --", it's only
the display value that is changed.
*/

// Message to be displayed when form is submitted successfully.
gs.include("FormInfoHeader");
var fi = new FormInfoHeader();
var s = 'Thank you for submitting your request.<br/>';
s += 'Your ticket number is: ' + current.number +'<br/>';
s += 'UTS Telecommunications Services will contact you if they need any further information.<br/>';
fi.addMessage(s);

// Pulls full user object from requestor field in DU Standard variable set
// Used for populating short description with client's name (see below)
// It seems like a lot of extra steps to me (creating a variable to store the user opject from caller_id, just to pull user's full name)
// But I haven't been able to get this to work without it. I'll update if I find a better way
//var user = producer.getReference('caller_id');
var requestor = gs.getUser();
requestor = requestor.getUserByID(producer.caller_id);

// This block of if statements sets the short description dynamically depending on the service requested in the form
if(producer.actionSelect == 'createVoicemail') {
	current.short_description = 'Voicemail Creation Request for ' + requestor.getFullName(); // Set short description for creation
}
if(producer.actionSelect == 'changeVoicemail') {	
	current.short_description = 'Voicemail Change Request for ' + requestor.getFullName(); // Set short description for change
}
if(producer.actionSelect == 'deleteVoicemail') {
	current.short_description = 'Voicemail Deletion Request for ' + requestor.getFullName(); // Set short description for deletion
}

// Fill non-conditional values in incident description
current.priority = calculatePriority(current.impact, current.urgency); // Calculate priority
current.assignment_group.setDisplayValue('Telecommunications Services'); // Sets assignment group
current.u_category.setDisplayValue('Network > Voicemail'); // Sets category
current.u_call_back_number = producer.phone; // Set contact phone number

// Create variable to store dynamic incident description
var details = 'Name: ' + requestor.getFullName() + '\n';
details += 'Contact email: ' + requestor.getEmail() + '\n';
details += 'Department: ' + producer.department +'\n';
details += '\n';

// Fill action requested (create/change/delete) into incident description
if(producer.actionSelect == 'createVoicemail') {
	details += 'Action requested: Create voicemail box \n';
}
if(producer.actionSelect == 'changeVoicemail') {
	details += 'Action requested: Change voicemail box \n';
}
if(producer.actionSelect == 'deleteVoicemail') {
	details += 'Action requested: Delete voicemail box \n';
}

// Fill variable falues (only if filled out) into incident description
if(producer.fundNumber.nil() == false){
	details +='Fund number: ' + producer.fundNumber + '\n';
}
if(producer.orgNumber.nil() == false){
	details +='Org number: ' + producer.orgNumber + '\n';
}
if(producer.voicemailPhone.nil() == false){
	details +='Line associated with voicemail: ' + producer.voicemailPhone + '\n';
}
// if(producer.mailboxType.nil() == false){
// 	details +='Mailbox type: ' + producer.mailboxType + '\n';
// }

details += producer.additionalComments; // Add additional comments to incident description
current.description = details; // Save description to incident

// Redirect user back to service catalog
producer.redirect = "catalog_home.do?sysparm_view=catalog_default"; 
