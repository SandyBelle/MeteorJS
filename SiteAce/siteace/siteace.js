Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {


// Routing => page flow for site
Router.configure ({
   layoutTemplate: 'ApplicationLayout' // default layout template
});

Router.route('/', function() {
	this.render('navbar',{
		to:"navbar"
	});
	this.render ('website_list',{
		to:"main"
	});
});

Router.route('/website_detail/:_id', function() {
	this.render('navbar',{
		to:"navbar"
	});
	this.render ('website_detail',{
		to:"main",
		data: function() {
			console.log("id is: " + this.params._id);
			return Websites.findOne({_id:this.params._id});
		}

	});
});

//********* USER AUTHENTICATION ***************
//*********************************************

// *** Modify the User Information Form for use ******
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'    
});

// Bind template (body) with helpers and pass it
// a function named username that will be called by the template
 Template.body.helpers({
    username:function (){
        // Check to see if user is logged in before proceeding
        if (Meteor.user()) { // if is true - valid
            console.log (Meteor.user().emails[0].address);
            //return Meteor.user().emails[0].address;
            return Meteor.user().username;         
        } else {
            return "! Login in";
        }
    }
 });

	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},
				{sort:{upvote:-1}}
			);
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			var rate = this.upvote;
			if (rate > 0 ) {
				rate = rate +1;
			} else	{
				rate = 1;
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id}, {$set: {upvote:rate}});
			console.log( website_id + "rate is : " + rate);
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+ website_id);

			var rate = this.downvote;
			if (rate <= 0 ) {
				rate = rate - 1;
			} else	{
				rate = 0;
			}

			// put the code in here to remove a vote from a website!
			Websites.update({_id:website_id}, {$set: {downvote:rate}});			
			console.log( website_id + "down vote rate is : " + rate);
			return false;// prevent the button from reloading the page
		}
	});

	Template.website_detail.events({
		"submit .js-save-website-item-detail": function() {

			var myErrorMsg = "";
	
			var comment = event.target.comment.value;
			console.log("The comment they entered is: "+ comment +
				"the id is: " + this._id);

			//  put details comments saving code in here!	
	        if (Meteor.user()){ // if a user is logged in then
	        	if (comment == "" ) {
	        		myErrorMsg = myErrorMsg + " Please enter a comment.  ";
	        		console.log("Please enter a comment");
	        	} 
	        	if (myErrorMsg == "") // No missing data. Save the entry.
	        	{
			    	  Websites.update(
			    	  	{_id:this._id}, 
			    	  	{$set: {comments:comment}}
			    	);

					console.log("Saved!");
					
				} else	{
					console.log("ERROR: " + myErrorMsg);
					alert(myErrorMsg);
				}
	        }
			return false;
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			var myErrorMsg = "";
			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+ url);
			
			var title = event.target.title.value;
			console.log("The title they entered is: "+ title);

			var description = event.target.description.value;
			console.log("The description they entered is: "+ description);


			//  put your website saving code in here!	
        if (Meteor.user()){ // if a user is logged in then
        	if (url == "" ) {
        		myErrorMsg = myErrorMsg + " Please enter the URL.  ";
        		console.log("Please enter a url");
        	} 

        	if (title == "") {
        		myErrorMsg = myErrorMsg + " Please enter the TITLE.  ";
        		console.log("Please enter a TITLE");

        	}
        	if (description == "") {
        		myErrorMsg = myErrorMsg + " Please enter the DESCRIPTION.  ";
        		console.log("Please enter a DESCRIPTION");
        	}
        	if (myErrorMsg == "") // No missing data. Save the entry.
        	{
		    	  Websites.insert({
		    		title:title, 
		    		url:url, 
		    		description:description, 
		    		createdOn:new Date(),
		    		upvote:0,
		    		downvote:0
		    	});

				console.log("Saved!");
				$("#website_form").toggle('slow');
			} else	{
				console.log("ERROR: " + myErrorMsg);
				alert(myErrorMsg);
			}
		}

		return false;// stop the form submit from reloading the page

		}
	});
	
}  // end Meteor.isClient


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date()
    	});
    }
  });
}



