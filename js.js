class productos {

    constructor(id, nombre, preciobase, img) {
        this.id = id;
        this.nombre = nombre;
        this.preciobase = preciobase;
        this.descuento = 0;
        this.iva = 0;
        this.preciofinal = preciobase;
        this.img = img;

    }

    agregariva(ivamano) {
        this.iva = ivamano;
    }
    mostariva() {
        this.iva;
    }

    agregarpreciofinal(preciofinal) {
        this.preciofinal = preciofinal;
    }
    mostarpreciofinal() {
        this.preciofinal;
    }

    CalcularPrecioFinal() {
        this.preciofinal = this.preciobase + ((this.iva / 100) * this.preciobase);
    }

    CalcularDescuento() {

        this.preciofinal = parseInt(this.preciofinal - ((this.descuento / 100) * this.preciofinal));


    }

}



let Producto1 = new productos(1, "IPAD", 1000, "img/ipad.png");
let Producto2 = new productos(2, "MACBOOK", 1250, "img/macbook.png");
let Producto3 = new productos(3, "TV LED", 1435, "img/tvled.png");
let Producto4 = new productos(4, "IPHONE", 1341, "img/iphone.png");
let Producto5 = new productos(5, "IPHONE", 1341, "img/iphone.png");



let Carrito = [];

let ProductosJson;


if (localStorage.getItem("carrito") == null) {

    $.get("./productosJson.js", function (data) {

        ProductosJson = JSON.parse(data);

        for (const iterator of ProductosJson) {

            let Producto1 = new productos(iterator.id, iterator.nombre, iterator.preciobase, iterator.img)
            Producto1.iva = iterator.iva;
            Producto1.preciofinal = iterator.preciofinal;
            Carrito.push(Producto1);

        }

        CargarProductos(Carrito);


    });



} else {

    let productoslocales = JSON.parse(localStorage.getItem("carrito"))
    console.log(productoslocales);

    for (const iterator of productoslocales) {

        let Producto1 = new productos(iterator.id, iterator.nombre, iterator.preciobase, iterator.img)
        Producto1.iva = iterator.iva;
        Producto1.preciofinal = iterator.preciofinal;
        Carrito.push(Producto1);
    }
    CargarProductos(Carrito);

}



$("#btnGetUsuario").click(() => {
    $("#usuariobarra").empty();
    $("#usuariobarra").toggle()
    $.get("./usuarioJson.js", function (data) {

        const usuario = JSON.parse(data);
        $("#usuariobarra").prepend(`
                <div>
                    <span class="usariospan">${usuario[0].email}</span>
                </div>
                <div class="usuariobarra"></div>
                <div>
                    <span class="usariospan">${usuario[0].name}</span>
                </div>
    `)


    })
});


function CargarProductos(Carrito) {

    $("#contenedor-productos").empty();

    for (const iterator of Carrito) {

        $("#contenedor-productos").append(


            `       
<div class="tarjeta col">
<div class="tarjetaimagen">
<img src="${iterator.img}" class="ImagenProducto">
        </div>
        <div class="tarjetaprecion">
        <span class="tarjetaLetraNombre">${iterator.nombre}</span>

            <span class="tarjetaLetraPrecio">$${iterator.preciofinal}</span>
            <button id= "btn${iterator.id}" type="button" class="btnTarjeta" >Descuento</button>

        </div>

        </div>
        `
        );


        $(`#btn${iterator.id}`).on('click', function () {
            $("#contenedor-form").empty();

            $("#contenedor-form").fadeIn();

            CambiarPrecio(iterator.id);
        });
    }

    $("#contenedor-productos").fadeIn();


}

function CambiarPrecio(elemento) {
    const producto = Carrito.filter(productos => productos.id == elemento);

    $("#contenedor-form").append(
        `<form>
    <label>Producto</label>
    <input type="text" id="fproducto" name="fproducto" placeholder="Your name.." class="cajas" value="${producto[0].nombre}" readonly>

    <label>Precio Base</label>
    <input type="number" id="fpreciobase" name="fpreciobase" placeholder="descuento" class="cajas" value="${producto[0].preciobase}" >

    <label>Descuento</label>
    <input type="number" id="fdescuento" name="fdescuento" placeholder="descuento" class="cajas" min="0"
        max="90" value="${producto[0].descuento}">

    <label>IVA</label>
    <select id="fiva" name="fiva" class="cajas">
        <option value="21">21%</option>
        <option value="10.5">10.5%</option>
        <option value="27">27%</option>
    </select>
    <div class="row">

        <div class="col">
        <button type="button" id="btnProcesar" class="btnTarjeta" >Modificar</button>
        </div>

        <div class="col">
        <button type="button" id="btnCerrar" class="btnTarjeta" >Cerrar</button>
        </div>

    </div>

    </form>
    `
    )

    $(`#btnProcesar`).on('click', function () {

        ProcesarNueveoPrecio(elemento)

    });
    $(`#btnCerrar`).on('click', function () {

        $("#contenedor-form").fadeOut("slow");

    });

    var scrollBottom = $(window).scrollTop() + $(window).height();

    window.scrollTo(0, scrollBottom);

}


function ProcesarNueveoPrecio(elemento) {
    const descuento = document.getElementById("fdescuento");
    const iva = document.getElementById("fiva");
    const precioBase = document.getElementById("fpreciobase");
    for (const iterator of Carrito) {

        if (iterator.id == elemento) {
            iterator.preciobase = parseInt(precioBase.value);
            iterator.descuento = parseInt(descuento.value);
            iterator.iva = parseFloat(iva.value);

            iterator.CalcularPrecioFinal();

            iterator.CalcularDescuento();

            $("#contenedor-form").fadeOut("slow", CargarProductos(Carrito));

            break;
        }


    }
    window.scrollTo(0, 0);

    // Store
    localStorage.setItem("carrito", JSON.stringify(Carrito));

}

/* BUSCA LAS MEJORES OFERTAS DE DESCUETON*/
function ProductosEnSuperOfertas() {

    const SuperOferta = Carrito.filter(productos => productos.descuento > 10);

    console.log("Ofertones", SuperOferta);
}


function OrdenarPorMenorPrecio() {

    Carrito.sort(function (a, b) {
        if (a.preciofinal > b.preciofinal) {
            return 1;
        }
        if (a.preciofinal < b.preciofinal) {
            return -1;
        }
        if (a.preciofinal == b.preciofinal) {
            if (a.nombre > b.nombre) {
                return 1;
            }
            if (a.nombre < b.nombre) {
                return -1;
            }
        }
        // a must be equal to b
        return 0;
    });

}
