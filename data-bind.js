// databind
// Rodrigo Nishino <rodrigo.nsh@gmail.com>

var data = {}

function traverse(object, key, newValue)
{
	//if ( debug ) console.log(object, key, newValue)
	
	let partes = key.split(".")
	
	
	// TODO: check if numerical keys work 
	if ( partes.length == 1 )
	{
		//check if is variable for a key elsewhere
		if ( key.startsWith("[") )
		{
			// strip [ & ]
			newKey = key.substring(1, key.length - 1 )
			key = traverse(data, newKey)
		}
		
		if ( undefined !== newValue )
		{
			object[ key ] = newValue
		}
		
		//console.log(object[ key ])
		
		return object[ key ]
	}
	
	else
	{
		
		var next = partes.shift()
		
		//console.log(next)
		
		//check if is variable for a key elsewhere
		if ( next.startsWith("[") )
		{
			
			// strip [ & ]
			newKey = next.substring(1, next.length - 1 )
			
			//console.log("it's a key variable", next)
			
			next = traverse(data, newKey)
			
			console.log(newKey, next)
		}
		
		//console.log(">> ", next)
		
		var deeper = object[ next ]
		var shorter = partes.join(".")
		
		return traverse(deeper, shorter, newValue)
		
	}
}

function databind()
{
  
  //console.log('databind');
  
  $body.querySelectorAll("[data-bind]").forEach(function(el, i)
  {
    
    try
    {

		var tag = el.tagName
		
		// todo: traverse address with recursive function
		res = traverse(data, el.dataset.bind)
		
		//console.log( tag, el, res )
		twoWayTags = ['INPUT', 'ONS-INPUT', 'SELECT', 'TEXTAREA']
		
		if (  twoWayTags.indexOf(tag) > -1 && !el.hasAttribute("bound") )
		{
			
			
			
			el.setAttribute("bound", true)
			
			el.addEventListener("change", function(ev)
			{
				var t = ev.target	
				var k = t.dataset.bind
				var v = t.value
				
				if (debug) console.log("CHANGED", t, k, v)
				
				var partes = k.split(".")
				var last = partes.pop()
				
				// TODO: auto set type to number?
				
				if ( last.startsWith("i_") )
				{
					traverse(data, k, parseInt(v))
				}
				
				else if ( last.startsWith("f_") )
				{
					traverse(data, k, parseFloat(v.replace(",", ".")))
				}
				
				else
				{
					traverse(data, k, v)
				}
				
			})
						
		}
		
		if ( undefined === res )
		{
		  el.setAttribute("undefined", true)
		  return
		}
		
		
		el.removeAttribute("undefined")
		el.removeAttribute("null")
		
		
		if ( tag == "IMG" )
		{
		  el.src = res
		}
		
		else if ( tag == "AUDIO" || tag == "VIDEO")
		{
		  el.src = res
		}
		
		else if ( tag == "SWITCHER" )
		{
		  
		  if( res == null ) el.removeAttribute("on")
		  else el.setAttribute("on", "on")
		  
	  }
		
		else if ( twoWayTags.indexOf(tag) > -1 )
		{
			el.value = res
		}
		
		else { el.textContent = res }
    
    }
    
    catch(err)
    {
		el.setAttribute("null", true)
    }
    
    
  });
  
  $body.querySelectorAll('[bind-placeholder]').forEach( function(el, i)
  {
    let res = data[el.getAttribute('bind-placeholder')]
    el.setAttribute('placeholder', res)
  });
  
}
