// Hago fetch para consumir la info de usuarios desde API que hice para el curso
function llamarAPI() {
    const json =
        fetch('http://localhost:8080/webapp-1.0.0-SNAPSHOT/ListarUsuariosController')
        .then(response=>response.json())
        .then(data=>dibujarDatos(data));
}

async function crearUsuario() {
    var nombreUsuario = document.getElementById('txtNombre').value;
    var apeUsuario = document.getElementById('txtApellido').value;
    var mailUsuario = document.getElementById('txtEmail').value;
    var pwdUsuario = document.getElementById('pwdPassword').value;
    //var fnacUsuario = document.getElementById('dtFnac').value;
    var paisUsuario = document.getElementById('selPais').value;
    
    const jsonRequest = {
        nombreUsuario,
        apeUsuario,
        mailUsuario,
        pwdUsuario,
        paisUsuario
        //,fnacUsuario
    };
    // puedo usar formdata o mandar los datos en formato JSON
    // el profe prefiere json
    const json = JSON.stringify(jsonRequest);
    
    fetch('http://localhost:8080/webapp-1.0.0-SNAPSHOT/CrearUsuarioController', {
        method: 'POST',
        body: json,
        headers: new Headers({
            'Content-Type': 'text/json'
        })
    });
    
    llamarAPI();
    
}

async function eliminarUsuario(idUsuario) {
    if(confirm('¿Deseas eliminar el usuario de ID ' + idUsuario + '?')) {
        try {
            fetch('http://localhost:8080/webapp-1.0.0-SNAPSHOT/EliminarUsuarioController?idUsuario=' + idUsuario, {
                method: 'DELETE'
              })
              .then(response => {
                if (response.ok) {
                  alert('Usuario eliminado correctamente');
                  llamarAPI();
                } else {
                    alert('Error al eliminar el usuario');
                }
              })
              .catch(error => {
                alert('Error de red');
                console.error('Error de red:', error);
              });
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            alert('Hubo un error al intentar eliminar el usuario');
        }
    }
}

async function editarUsuario(id) {
    var txtNombre = "txtNombreUsuario-" + id;
    var txtApe = "txtApeUsuario-" + id;
    var txtMail = "txtMailUsuario-" + id;
    var txtPwd = "txtPwdUsuario-" + id;
    var txtPais = "selPaisUsuario-" + id;
    var dtFnac = "dtFnacUsuario-" + id;
    var nombre = document.getElementById(txtNombre).value;
    var ape = document.getElementById(txtApe).value;
    var mail = document.getElementById(txtMail).value;
    var pwd = document.getElementById(txtPwd).value;
    var fnacUsuario = document.getElementById(dtFnac).value;
    var pais = document.getElementById(txtPais).value;    

    alert("Actualización de usuario con ID=" + id + " en proceso...");

    const usuario = {
        idUsuario: id, 
        nombreUsuario: nombre,
        apeUsuario: ape,
        mailUsuario: mail,
        pwdUsuario: pwd,
        fnacUsuario: fnacUsuario,
        paisUsuario: pais
    };
    
    try {
        const response = await fetch('http://localhost:8080/webapp-1.0.0-SNAPSHOT/EditarUsuarioController', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert('¡Usuario actualizado correctamente!');
        } else {
            alert('Error al actualizar el usuario.');
            console.error('Error al actualizar el usuario:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

function dibujarSelectPaises(id, pais) {
    var html = '';
    html += '<select id="' + id + '" name="pais" required><option value="' + pais + '" selected>' + pais + '</option><option value="Argentina">Argentina</option><option value="Bolivia">Bolivia</option><option value="Brasil">Brasil</option><option value="Chile">Chile</option></select>';
    return html;
}

function dibujarDatos(json) {
    const filas = new Map(Object.entries(json));
    var html = '';
    html +=('<table class="table">');
    html +=('<tr><th scope="col">ID</th>');
    html +=('<th scope="col">Nombre</th>');
    html +=('<th scope="col">Apellido</th>');
    html +=('<th scope="col">E-Mail</th>');
    html +=('<th scope="col">Password</th>');
    html +=('<th scope="col">Fecha de nacimiento</th>');
    html +=('<th scope="col">País de origen</th>');
    html +=('<th scope="col"></th>');
    html +=('<th scope="col"></th></tr>');
    for(f of filas) {
        var fecha = new Date(f[1]["fnacUsuario"]);
        var fechaFormateada = fecha.toISOString().split('T')[0];
        html +=('<tr>');
        html += ('<td>' + f[1]["idUsuario"] + '</td>');
        html += ('<td><input type="text" id=txtNombreUsuario-' + f[1]["idUsuario"] + ' value="' + f[1]["nombreUsuario"] + '"></td>');
        html += ('<td><input type="text" id=txtApeUsuario-' + f[1]["idUsuario"] + ' value="' + f[1]["apeUsuario"] + '"></td>');
        html += ('<td><input type="text" id=txtMailUsuario-' + f[1]["idUsuario"] + ' value="' + f[1]["mailUsuario"] + '"></td>');
        html += ('<td><input type="text" id=txtPwdUsuario-' + f[1]["idUsuario"] + ' value="' + f[1]["pwdUsuario"] + '"></td>');
        html += ('<td><input type="date" id=dtFnacUsuario-' + f[1]["idUsuario"] + ' value="' + fechaFormateada + '"></td>');
        html += ('<td>' + dibujarSelectPaises('selPaisUsuario-' + f[1]["idUsuario"], f[1]["paisUsuario"])+ '</td>');
        html += ('<td><a href="#" onclick="editarUsuario(' + f[1]["idUsuario"] + ')">Editar</a></td><td><a href="#" onclick="eliminarUsuario(' + f[1]["idUsuario"] + ')">Eliminar</a></td>');
        html +=('</tr>');
    }
    html +=('</table>');
    document.getElementById('resultado').innerHTML = html;
}

// Cuando carga la página me trae todos los datos
document.addEventListener('DOMContentLoaded', (event) => {
    llamarAPI();
});