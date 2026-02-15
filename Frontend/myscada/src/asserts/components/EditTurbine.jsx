import React, { useState } from 'react'

const EditTurbine = () => {
    const [turbine, editTurbine] = useState({})
    const mc_name = "Test-103";
  return (
    <div className='et_root_container'>
      <h3>Edit {mc_name} Turbine</h3>
      <div className="glass_card et_form_container">
        <form action="" className='et_form'>
            <input type="number" placeholder='Machine ID' disabled />
            <input type="number" placeholder='User ID' disabled />
            <input type="text" placeholder='Machine Name' required />
            <input type="number" placeholder='HTSC Number' required/>
            <input type="text" placeholder='Location' required />
            <input type="number" placeholder='Capacity' required/>
            <button>Update</button>
        </form>
      </div>
    </div>
  )
}

export default EditTurbine
