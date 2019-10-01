var $body = q("body")
var $doc = document.documentElement;
var debug = true

function q(selector)
{
  
  var node = document.querySelector(selector)

  if ( node == null && debug ) console.warn("cant select", selector)
  
  return node;
  
}

function storageGet( name, def )
{
  
  var ret = localStorage.getItem(name)
    
  if ( ret == null && undefined !== def )
  {
    ret = def
  }  
  
  return  ret
}

function storageJGet( name, def )
{

  let ret = storageGet(name, def);
  let j = JSON.parse(ret);
  return j
  
}

function replace(noot, bimbom, donde)
{
  do
  {
    donde = donde.replace(noot, bimbom)
  } while( donde.indexOf(noot) > -1 ) 
  
  return donde
}


function emit(actionName, ev)
{
  var customEvent = new Event( actionName )
  customEvent.originalEvent = ev
  
  /*if (debug)*/ console.info( actionName, ev )
  dispatchEvent( customEvent )
}

function create(nome, content)
{
  let el = document.createElement(nome)
  
  if ( undefined != content)
  {
    if ( typeof content == "string" ) el.textContent = content
    else el.appendChild(content)
  }
  
  return el
}

function getTarget(t, name)
{
  
  if ( ! ( 'dataset' in t ) ) { t.dataset = {} }
  
  while( !( name in  t.dataset ) )
  {
    
    t = t.parentNode
    
    if ( undefined == t )
    {
      console.error("Você está passando o target correto?");
    }
    
    if ( ! ( 'dataset' in t ) ) { t.dataset = {} }
  }
  return t
}

function tapHandler(ev)
{
  
  //ev.preventDefault()
  //ev.stopPropagation()
  
  var target = ev.target
  
  //if(debug) console.log('taphandler ', target)
  
  while( target && 'hasAttribute' in target )
  {
    
    if (target.hasAttribute("emit"))
    {
      
      var actionName = target.getAttribute("emit")
      emit(actionName, ev)
    }
    
    if ( target.hasAttribute("confirm") )
    {
      ev.data = target.getAttribute("confirm")
      emit("confirm", ev)
    }
    
    target = target.parentNode
    
  }
}

var touche = false;
addEventListener("touchstart", function(ev)
{
	//console.log("touchstart")
	touche = true
	tapHandler(ev)
})


addEventListener("click", function(ev)
{
  //console.log("click before")
  if ( touche ) return
  if ( ev.button == 2 ) return;
  //console.log("click after")
  
  tapHandler(ev)

})





// https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
function throttle(callback, wait, context = this) {
  let timeout = null 
  let callbackArgs = null
  
  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }
  
  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}
