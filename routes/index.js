/*	index.js

	For Indian Hills Community College
	Parking On Hills, https://parking.indianhils.edu
	by Blaine Harper

	PURPOSE: Root router for express server
*/	
var fs = require('fs');
var express = require('express');
var router = express.Router();
const path = require('path');

var fetch = require('../fetch');
var { GRAPH_ME_ENDPOINT } = require('../authConfig');

require('dotenv').config({ path: '.env.dev' });

/* GET cover page. */
router.get('/', function(req, res, next) {
	res.render('base/mixins/cover', { 
		env: req.session.env,
		isAuthenticated: false,
		title: 'Phi Lambda Phi', 
		subtitle: 'Minecraft Server Administration - JAVA'});
});

/* Redirect to login page. */
router.get('/login', function(req, res, next) {
	res.redirect('/users/me');
});


/* GET home page. */
router.get('/home', function(req, res, next) {
//		Put Buttons in Subcontent
		subcontent = ``;
		subcontent += `The Phi Lamb Minecraft servers can be accessed at mine.philamb.info!
					<div class="row">
						<form  target="dummyFrame" id="dummyForm" method="post" style="display: none;"></form>
						<iframe name="dummyFrame" id="dummyFrame" style="display: none;"></iframe>
						<div class="col-md-6 col-12 my-2 offset-md-3">
							<div class="row py-3">
								<div class="mb-3">
									Server Commands
								</div><hr>
								<div class="row">
									<div class="btn-group" role="group">										
										<button formaction="/java?command=/save-all" type="submit" form="dummyForm" class="btn btn-primary" id="btnCommandSaveAll">Save All</button>	
									</div>
								</div>
							</div>
							<div class="row py-3">
								<div class="mb-3">
									Time Commands
								</div><hr>
								<div class="row">
									<div class="btn-group" role="group" aria-label="Basic example">										
										<button formaction="/java?command=/time%20set%20day" type="submit" form="dummyForm" class="btn btn-primary" id="btnCommandMorning">Morning</button>			
										<button formaction="/java?command=/time%20set%20noon" type="submit" form="dummyForm" class="btn btn-warning" id="btnCommandNoon">Noon</button>			
										<button formaction="/java?command=/time%20set%20night" type="submit" form="dummyForm" class="btn btn-dark" id="btnCommandNight">Night</button>
									</div>
								</div>
							</div>
							<div class="row py-3">
								<div class="mb-3">
									Weather Controls
								</div><hr>
								<div class="row">
									<div class="btn-group" role="group" aria-label="Basic example">										
										<button formaction="/java?command=/weather%20clear" type="submit" form="dummyForm" class="btn btn-secondary" id="btnCommandWeatherClear">Clear</button>			
										<button formaction="/java?command=/weather%20rain" type="submit" form="dummyForm" class="btn btn-primary" id="btnCommandWeatherRain">Rain</button>			
										<button formaction="/java?command=/weather%20thunder" type="submit" form="dummyForm" class="btn btn-warning" id="btnCommandWeatherThunder">Thunder</button>	
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-3 col-12">
							<div id="alertTimePlaceholder"></div>
						</div>
					</div>
					
					<script>
						function refreshPage(){
							window.location.reload();
						} 
						
						const appendAlert = (placeholder, message, type) => {
							const wrapper = document.createElement('div')
							wrapper.innerHTML = [
								'<div class="alert alert-'+type+' alert-dismissible" role="alert">',
								'   <div>'+message+'</div>',
								'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
								'</div>'
							].join('')

							placeholder.append(wrapper)
						}
						
						const addTrigger = (placeholder, trigger, message, type) => {
							if (trigger) {
								trigger.addEventListener('click', () => {
									appendAlert(placeholder, message, type)
								})
							}		
						}

						const alertPlaceholder = document.getElementById('alertTimePlaceholder')
						
//						Server Commands
						
						var alertTrigger = document.getElementById('btnCommandSaveAll');
						addTrigger(alertPlaceholder, alertTrigger, 'Server saving!', 'success');
						var alertTrigger = document.getElementById('btnCommandStop');
						addTrigger(alertPlaceholder, alertTrigger, 'Server shutting down!', 'success');
						
//						Time Commands

						var alertTrigger = document.getElementById('btnCommandMorning');
						addTrigger(alertPlaceholder, alertTrigger, 'Server time set to Morning!', 'success');
						alertTrigger = document.getElementById('btnCommandNoon');
						addTrigger(alertPlaceholder, alertTrigger, 'Server time set to Noon!', 'success');	
						alertTrigger = document.getElementById('btnCommandNight');
						addTrigger(alertPlaceholder, alertTrigger, 'Server time set to Night!', 'success');
						
//						Weather Commands
						
						var alertTrigger = document.getElementById('btnCommandWeatherClear');
						addTrigger(alertPlaceholder, alertTrigger, 'Server weather set to clear!', 'success');
						var alertTrigger = document.getElementById('btnCommandWeatherRain');
						addTrigger(alertPlaceholder, alertTrigger, 'Server weather set to rainy!', 'success');
						var alertTrigger = document.getElementById('btnCommandWeatherThunder');
						addTrigger(alertPlaceholder, alertTrigger, 'Server weather set to thunderstorms!', 'success');
					</script>`;
		content = [{parallax: {rem:'10', url:'/res/plp/graphics/philamb_flag.png'}, hero : {title:'Server Commands', content:subcontent}}];
		
		res.render('pages/basicText', { 
			env: req.session.env,
			isAuthenticated: false,
			title:'Commands', 
			page:{
				content: content
		}
	});
});

router.get('/status', function(req, res, next) {
	res.send({'status':200});
});

module.exports = router;