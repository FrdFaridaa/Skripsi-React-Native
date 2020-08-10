const rs = {
	json: async (obj) => {
		var o = Object.assign({
			url: '',
			data: {},
			get: {},
			header: {
	    	method: 'GET'
			},
			done: (json) => {
				console.log(json)
			}
		}, obj);

		var urlGet = o.url.split("?").length > 1 ? '&' : '?',
				keyGet = Object.keys(o.get);
		if(keyGet.length > 0){
			for(var i in keyGet){
				o.url += `${(parseInt(i) > 0 ? '&' : urlGet)}${keyGet[i]}=${encodeURIComponent(o.get[keyGet[i]])}`;
			}
		}

		if(Object.keys(o.data).length > 0){
			o.header = {
		  	method: 'POST',
		    headers: {
					'Accept': 'application/json',
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(o.data)
			}
		}
	  var json = {
    	status: 'error', 
    	message: `Unknown`,
    	data: []
    };
	  try {
	    const response = await fetch(o.url, o.header);
	    json.message = `Error ${response.status}`;
	    if(response.ok){
		    json = await response.json();
	    }
		  return o.done(json, response, o);
	  } catch (error) {
	    console.error(error);
	    json.message = `Error ${error}`;
		  return o.done(json, response, o);
	  }
		// fetch(o.url, o.header).then(response => {
		// 	console.log(response)
		// 	response.json().then(data => ({
		// 		status: response.status,
		// 		body: data
		// 	}));
		// }).then(json => {
		// 	console.log(o, json);
		// 	// o.done
		// });
	}
}
export default rs;