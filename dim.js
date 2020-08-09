//Function that does stuff with the history API

function pushHistory(title, url, name){
    console.log(name)
    history.pushState({url: url}, "Test", name)
    sessionStorage.setItem("dim_location", url)
    console.log(url)
}



class Dim {
    constructor(tags=[],anim_class="",base_route=""){
        this.tags = tags
        this.anim_class = anim_class
    }
    //Function meant to be recursively called when a element has children 
    dim_cre(e, children){

        for(let i of  Array.from(children)){
            console.log(children)
            if(i.classList.contains("dim_ex") || i.classList.contains("dim_link")){
                console.log("excluded")
                console.log(i.children.length)
                if(i.classList.contains("dim_ex") && i.children.length){
                    console.log(i)
                    this.dim_cre(i, i.children)
                }
            }else {
                if(i.children.length){
                    this.dim_cre(i, i.children)
                }else {
                    console.log(i)
                    e.removeChild(i)
                }
            }
        }

        console.log(e)
        if(e.classList.contains("dim_ex")){
            console.log(e)
        }else {
            e.remove()
        }
    }

    dim_render(obj){
        //body rendering 
        let body = document.body
        let head = document.head

        for(let e of Array.from(body.children)){
            if(e.classList.contains("dim_ex") || e.classList.contains("dim_link")){
                console.log("excluded")
                console.log(e.children.length)
                if(e.classList.contains("dim_ex") && e.children.length){
                    this.dim_cre(e, e.children)
                }
            }else {
                console.log("removed")
                e.remove()
            }
        }

        //Deleting links of dim_link
        let links = document.getElementsByClassName("dim_link")
        for(let e of Array.from(links)){
            if(e.classList.contains("dim_linkex")){
                console.log("Not removed")
            }else {
                console.log("Link removed")
                e.remove()
            }
        }

        //Replaces to defined elements happen here
        for(let i of obj.replaces){
            let element = document.getElementById(i.id)
            if(element){
                element.outerHTML = i.content
            }else {
                console.warn("Make sure you have an element with the tag ", i.id)
            }
        }

        //Adding of new content happens here
        if(obj.content){
            let parser = new DOMParser()
            let last_el = document.body.lastElementChild
            console.log(obj.content)
            let html = parser.parseFromString(obj.content, "text/html")
            console.log(html)
            for(let i of Array.from(html.body.children)){
                console.log(i)
                let that = this
                body.insertBefore(i, last_el)
                if(this.anim_class){
                    i.classList.add(this.anim_class)
                    i.addEventListener("webkitAnimationEnd", function(){
                        this.classList.remove(that.anim_class)
                        console.log(this)
                    })
                }
            }
        }else {
            console.dir(document.body)
        }
        
        //head rendering
        console.log(obj)
        for(let e of Array.from(head.children)){
            if(e.classList.contains("dim_ex") || e.classList.contains("dim_link")){
                console.log("excluded")
                console.log(e.children.length)
                if(e.classList.contains("dim_ex") && e.children.length){
                    this.dim_cre(e, e.children)
                }
            }else {
                console.log(e)
                console.log("removed")
                e.remove()
            }
        }
        if(obj.head){
            let parser = new DOMParser()
            let html = parser.parseFromString(obj.head, "text/html")
            for(let i of Array.from(html.head.children)){
                head.appendChild(i)
            }
        }else {
            console.dir(document.body)
        }
        
    }

    dim_load(){
        let dims = document.getElementsByClassName("dim_link")
        let that = this
        window.addEventListener("popstate", function(e){
            let state = e.state
            console.log(state)
            fetch(state.url)
                .then(function(res){
                    return res.json()
                })
                .then(function(data){
                    that.dim_render(data)
                })
        })
        //Finding elements with the class dim_link and adding a click event to them
        for(let link of dims){
            link.addEventListener("click", function(e){
                e.preventDefault()
                pushHistory("",this.href,"#" + this.getAttribute("linket"))
                fetch(this.href)
                    .then(function(res){
                        return res.json()
                    })
                    .then(function(data){
                        this.dim_render(data)
                    }.bind(that))
            })
            console.log(link)
        }
    }
}


let dim =  new Dim([],"enter")

console.log(dim)

dim.dim_load()