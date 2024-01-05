
export async function modificarUsuario(id){
   const res = await fetch(`http://localhost:3000/v2/actualizar/${id}`, {
       method: 'PUT',
       headers: {
           'Content-Type': 'application/json'
       }
       
   });
}

export async function eliminarUsuario(id){
    const res = await fetch(`http://localhost:3000/v2/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}