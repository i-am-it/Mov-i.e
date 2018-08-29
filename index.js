$(document).ready(()=>{
	//console.log("idna")
	let idBool = false
	let titleBool = false
	let yearBool = false

	$("form").submit((event)=>{
		event.preventDefault();
		idBool = $('#inlineRadio1').prop('checked')
		titleBool = $('#inlineRadio2').prop('checked')
		yearBool = $('#inlineRadio3').prop('checked')
		//checking which radio-button is selected

		if(idBool){
			let leId = $("#inputId").val()
			if (leId === "") {
				$("#errMsg").text("Opps! Looks like you forgot to enter the ID.")
			}
			else{
				console.log(leId)
				getMovieById(leId)
			}
		}
		else if(titleBool){
			let title = $("#inputTitle").val()
			if (title === "") {
				$("#errMsg").text("Opps! Looks like you forgot to enter the Title.")
			}
			else{
				console.log(title)
				getMovies(title)
			}
		}
		else if(yearBool){
			let title = $("#inputTitle").val()
			let year = $("#inputYear").val()
			if (title === "") {
				$("#errMsg").text("Please, enter the name of the movie/series you are looking for.")
			}
			else if (year === "") {
				$("#errMsg").text("Opps! Looks like you forgot to enter the year.")
			}
			else {
				console.log(title)
				getMovieByYear(title,year)
			}
		}
		//if none throw error
		else
		{
			$("#errMsg").text("Select a valid Search Criteria")
		}
	})


	$("#inlineRadio1").change(()=>{
		$("#errMsg").text("")
		//console.log("id")
		$("#inputTitle").val("")
		$("#inputYear").val("")
		$("#inputTitle").attr("readonly",true)
		$("#inputId").attr("readonly",false)
		$("#inputYear").attr("readonly",true)
	})

	$("#inlineRadio2").change(()=>{
		$("#errMsg").text("")
		//console.log("name")
		$("#inputId").val("")
		$("#inputYear").val("")
		$("#inputTitle").attr("readonly",false)
		$("#inputId").attr("readonly",true)
		$("#inputYear").attr("readonly",true)
	})

	$("#inlineRadio3").change(()=>{
		$("#errMsg").text("")
		//console.log("year")
		$("#inputId").val("")
		$("#inputTitle").attr("readonly",false)
		$("#inputId").attr("readonly",true)
		$("#inputYear").attr("readonly",false)
	})
	console.log("nhi hua")
	$("body").click((event)=>{
		//console.log("huaa")
		let clas = $(event.target).attr('class')
		if (clas.includes("findMovie")) {
		console.log("hua")
		let id = $(event.target).siblings(".card-text").children("span").text()
		getMovieById(id)
	}
	})

	$(".back").click(()=>{
		$("#movie").removeClass("show")
        $("#movies").addClass("show")
        $("#search").addClass("show")
        $("#movieD").html("")
	})

})

let getMovies = (tits)=>{
	console.log("making request")
	//console.log(tits);
	$(".showData").html("")
    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        async:true,
        url: `https://www.omdbapi.com/?s=${tits}&apikey=8dfd7bf4`, // URL of getting data
        success: (data) => { // in case of success response
            
            //console.log(data)
            if (data.Response === "True") {
            	$('html, body').animate({
				    scrollTop: $(".showData").offset().top
				  }, 1000)
            	$("#errMsg").text("")
	            let allMovie = data.Search
	            //console.log(allMovie)

	            for(movie of allMovie){

	            	console.log(movie)
	                 let tempRow = `<div class="card" style="width: 18rem;">
										<img class="card-img-top" src="${movie.Poster}" alt="Card image cap" onerror=this.src="images/noPoster.png">
										<div class="card-body">
										    <h5 class="card-title">${movie.Title}, <small>${movie.Year}</small></h5>
					    					<p class="card-text">IMDB Id  :  <span>${movie.imdbID}</span>  <br>Type  :  ${movie.Type} </p>
										    <a href="#" class="btn btn-primary findMovie">Get Full Details</a>
										 </div>
									</div>`

	                 $(".showData").append(tempRow) // placing data in division with id - 'showData'
	            }
		    } 

		    if (data.Response === "False") {
		    	$("#errMsg").text(`*Error : ${data.Error}. Please, try again.`)
		    }

           
        },
        error: (data) => { // in case of error response
        	//console.log(data)
            $("#errMsg").text("Please, try again. Make sure your internet is working")

        },

        beforeSend: () => { // while request is processing.

            // you can use loader here.
       
  // Calling the plugin
  // (prepends a div.loading to the target element)
  			$('#myModal').modal('show')
  			$('#target').loadingOverlay();

        },
        complete: () => {

  // Removing the loading overlay
  			$('#target').loadingOverlay('remove');
  			$('#myModal').modal('hide')


        },

        timeout:3000 // this is in milli seconds

    }); // end of AJAX request
}



let getMovieById = (imdbID)=>{
	console.log("making request")
	//console.log(imdbID);

    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        async:true,
        url: `https://www.omdbapi.com/?i=${imdbID}&apikey=8dfd7bf4`, // URL of getting data
        success: (data) => { // in case of success response
            
            //console.log(data)
            if (data.Response === "True") {
            	$("#errMsg").text("")
            	$("#movie").addClass("show")
	            $("#movies").removeClass("show")
	            $("#search").removeClass("show")
	            let movieDetails = data
	            let imdbrate = 'N/A'
	            let rtrate = 'N/A'
	            let merate = 'N/A'
	            if (movieDetails.Ratings[0]!==undefined) {
	            	imdbrate = movieDetails.Ratings[0].Value
	            }
	            if (movieDetails.Ratings[1]!==undefined) {
	            	rtrate = movieDetails.Ratings[1].Value
	            }
	            if (movieDetails.Ratings[2]!==undefined) {
	            	merate = movieDetails.Ratings[2].Value
	            }

	            $("#title").text(movieDetails.Title) 
	            $("#title").append(`, <span id="year">${movieDetails.Year}</span>`)
	            $("#moviePic").attr("src",movieDetails.Poster)
	            $("#plot").text(movieDetails.Plot) 

	                 let tempRow = `<div class="container">
										<div class="row">
											<div class="col">
												<span class="headin">Starring :</span> <span>${movieDetails.Actors}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Rated :</span> <span> ${movieDetails.Rated}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Released On :</span> <span> ${movieDetails.Released}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Runtime :</span> <span> ${movieDetails.Runtime}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Genre :</span> <span> ${movieDetails.Genre}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Director :</span> <span> ${movieDetails.Director}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Writer :</span> <span> ${movieDetails.Writer}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Language :</span> <span> ${movieDetails.Language}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Country :</span> <span> ${movieDetails.Country}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Awards :</span> <span> ${movieDetails.Awards}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Ratings :</span> <span> IMDB &nbsp&nbsp :&nbsp&nbsp${imdbrate}<br>
												Rotten Tomatoes &nbsp&nbsp :&nbsp&nbsp${rtrate}<br>
												Metacritic &nbsp&nbsp :&nbsp&nbsp${merate}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Metascore :</span> <span> ${movieDetails.Metascore}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">imdbVotes :</span> <span> ${movieDetails.imdbVotes}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">imdbID :</span> <span> ${movieDetails.imdbID}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Type :</span> <span> ${movieDetails.Type}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">DVD :</span> <span> ${movieDetails.DVD}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">BoxOffice :</span> <span> ${movieDetails.BoxOffice}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Production :</span> <span> ${movieDetails.Production}</span>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<span class="headin">Website :</span> <span><a href="${movieDetails.Website}">${movieDetails.Website}</span>
											</div>
										</div>
									</div>`

	                 $("#movieD").append(tempRow); // placing data in division with id - 'movieD'
	            }

                if (data.Response === "False") {
				    	$("#errMsg").text(`*Error : ${data.Error}. Please, try again.`)
				    }


           
        },
        error: (data) => { // in case of error response

            $("#errMsg").text("Please, try again. Make sure your internet is working")

        },

        beforeSend: () => { // while request is processing.

            // you can use loader here.
       
  // Calling the plugin
  // (prepends a div.loading to the target element)
  			$('#myModal').modal('show')
  			$('#target').loadingOverlay();


        },
        complete: () => {

  // Removing the loading overlay
  			$('#target').loadingOverlay('remove');
  			$('#myModal').modal('hide')

        },
        timeout:3000 // this is in milli seconds

    }); // end of AJAX request
}


let getMovieByYear = (tit,yea)=>{
	//console.log("making request")
	//console.log(tit);
	$(".showData").html("")
    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        async:true,
        url: `https://www.omdbapi.com/?s=${tit}&y=${yea}&apikey=8dfd7bf4`, // URL of getting data
        success: (data) => { // in case of success response
            
            console.log(data)
            if (data.Response === "True") {
            	$('html, body').animate({
				    scrollTop: $(".showData").offset().top
				  }, 1000)
            	$(".showData").focus()
            	$("#errMsg").text("")
	            let allMovie = data.Search
	            console.log(allMovie)

	            for(movie of allMovie){

	            	console.log(movie)
	                 let tempRow = `<div class="card" style="width: 18rem;">
										<img class="card-img-top" src="${movie.Poster}" alt="Card image cap" onerror=this.src="images/noPoster.png">
										<div class="card-body">
										    <h5 class="card-title">${movie.Title}, <small>${movie.Year}</small></h5>
					    					<p class="card-text">IMDB Id  :  <span>${movie.imdbID}</span>  <br>Type  :  ${movie.Type} </p>
										    <a href="#" class="btn btn-primary findMovie">Get Full Details</a>
										 </div>
									</div>`

	                 $(".showData").append(tempRow) // placing data in division with id - 'showData'
	            }
        	}
            if (data.Response === "False") {
		    	$("#errMsg").text(`*Error : ${data.Error}. Please, try again.`)
		    }
           
        },
        error: (data) => { // in case of error response

            $("#errMsg").text("Please, try again. Make sure your internet is working")

        },

        beforeSend: () => { // while request is processing.

            // you can use loader here.
       
  // Calling the plugin
  // (prepends a div.loading to the target element)
  			$('#myModal').modal('show')
  			$('#target').loadingOverlay();

        },
        complete: () => {


  // Removing the loading overlay
  			$('#target').loadingOverlay('remove');
  			$('#myModal').modal('hide')

        },

        timeout:3000 // this is in milli seconds

    }); // end of AJAX request
}