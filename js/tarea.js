class Tarea{
    constructor(id, texto, estado, contenedor){
        this.id = id;
        this.texto = texto;
        this.editando = false;
        this.crearDOM(estado, contenedor);
    }

    crearDOM(estado, contenedor){
        this.DOM = document.createElement("div");
        this.DOM.className = "tarea";


        //----------------------- texto de tarea --> h3
        let textoTarea = document.createElement("h3");
        textoTarea.className = "visible";
        textoTarea.innerText = this.texto;


        //------------------------- editor tarea --> input
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type", "text");
        editorTarea.setAttribute("value", this.texto);


        //--------------------------- boton editar
        let botonEditar = document.createElement("button");
        botonEditar.className = "boton";
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => this.actualizarTexto());

        //-------------------------------- boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.className = "boton";
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click", () => this.borrarTarea());
        

        //----------------------------- boton estado
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${estado ? "terminada" : ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.actualizarEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(() => console.log("mostrar error"));
        });


        // ------------------------- dom 
        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);

        contenedor.appendChild(this.DOM);
    }

    borrarTarea(){
        fetch("https://ceidwfs24-api-todo.onrender.com/tareas/borrar" + this.id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado, error}) => {
            if(!error){
                return this.DOM.remove();
            }
            console.log("mostrar error");
        })
        //this.DOM.remove();
    }
    /*
    borrarTarea = () => {
        this.DOM.remove();
        console.log(this);
    }
    */

    actualizarEstado(){
        return new Promise((ok, ko) => {
            fetch("https://ceidwfs24-api-todo.onrender.com/tareas/actualizar/2" + this.id, {
                method : "PUT"
            })
            .then(respuesta => respuesta.json())
            .then(({error}) => {
                !error ? ok() : ko();
                // console.log(error);
            })
            // ok();
        })
    }

    async actualizarTexto(){
        if(this.editando){
            let textoTemporal = this.DOM.children[1].value.trim();

            if(textoTemporal != "" && textoTemporal != this.texto){
                let {error} = await fetch("https://ceidwfs24-api-todo.onrender.com/taras/actualizar/1" + this.id, {
                    method : "PUT",
                    body : JSON.stringify({ tarea : textoTemporal }),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json());

                if(!error){
                    this.texto = textoTemporal;
                }else{
                    console.log("error al usuario");
                }
            }

            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[0].innerText = this.texto;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[2].innerText = "editar";

            // console.log("guardar");

        }else{
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.texto;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";

            // console.log("empezar a editar");
        }

        this.editando = !this.editando;
    }
}