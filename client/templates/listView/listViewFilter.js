Template.listViewFilter.helpers({
	
		'filter' : function(e){


		if($('#paperFilter').hasClass('active')){
			//papers 	
			console.log("logged it anyway");
			Router.go('/');
		} else if($('#summaryFilter').hasClass('active')){
			//summaries
			Router.go('summaryList');
		}
	
	}

});