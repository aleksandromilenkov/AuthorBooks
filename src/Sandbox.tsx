import { FormEvent, MouseEvent, useState } from 'react';
import './App.css';
type Student = {
  id: number;
  name: string;
  lastName:string;
  gender:string;
  age:number;
};
const Sandbox = () => {
 
  
  const object1 = { id:1, name:"PrvoIme", lastName:"PrvoPrezime", gender: "Male", age : 10};
  const object2= { id:2, name:"VtoroIme", lastName:"VtoroPrezime", gender: "Female", age : 20};
  const object3 = { id:3, name:"TretoIme", lastName:"TretPrezime", gender: "Male", age : 30};
  const object4 = { id:4, name:"CetIme", lastName:"CetPrezime", gender: "Female", age : 42};
  const object5 = { id:5, name:"PetIme", lastName:"PetPrezime", gender: "Male", age : 52};
  const object6 = { id:6, name:"SestoIme", lastName:"SestPrezime", gender: "Female", age : 62};
  const object7= { id:7, name:"SedmoIme", lastName:"SedPrezime", gender: "Male", age : 56};
  const object8 = { id:8, name:"OsmoIme", lastName:"OsmPrezime", gender: "Female", age : 43};
  const object9 = { id:9, name:"DevetoIme", lastName:"DevPrezime", gender: "Female", age : 12};
  const object10 = { id:10, name:"DesetoIme", lastName:"DesPrezime", gender: "Male", age : 51};
  const lista = [object1, object2, object3, object4, object5, object6, object7, object8,object9,object10];
  const [students, setStudents] = useState<Student[]>(lista);
  const [checked, setChecked] = useState<number[]>([]);

 

  const sortListByAge = () =>{
    const novaLista = [...lista].sort(function(a,b){
      return a.age - b.age;
    })
   
    setStudents(novaLista);
  }

  const sortByName = ()=>{
    const novaLista = lista.sort(function(a,b){
      return a.name.localeCompare(b.name);
    })
    setStudents(novaLista);
    console.log(novaLista);
  }
  const toggleStudents = ()=>{
    students.length === 0 ? setStudents(lista) : setStudents([])
  }



  const removeItem = ()=>{
   
    setStudents([...students].filter(student=> !checked.includes(student.id)))

  }
  const vekePostoiVoLista = (id: any)=>{
    const index = checked.findIndex(index=> index === id);
    
    if(index=== -1) return false; else return true;
  }
  const checkedHandler = (e: any, id: number)=>{
    
    if(e.target.checked){
        if(vekePostoiVoLista(id)){
          return null;
        }else{
          const novaLista = [...checked, id];
          setChecked(novaLista);
          
        }
    }else{
      const novaLista = checked.filter(index=> index !== id);
      setChecked(novaLista);
    }

    console.log(checked,'final')
  }

  const submitHandler = (e: any)=>{
    e.preventDefault();
  const student = {
    id: students.length +1,
    name: e.target.firstName.value,
    lastName: e.target.secondName.value,
    gender: e.target.gender.value,
    age: e.target.age.value,
  }
  
  setStudents([...students,student]);
  }
  return (
    <div className="App">
      <header className="App-header">
        
        
        <div>
          {  students.map((student,index)=> <div key={index}> <span> <input type='checkbox' className='deleteItem' onClick={(e)=>checkedHandler(e,student.id)} ></input></span>  {student.name} {student.age}</div>) }
        </div>

        <div>
          <form onSubmit={(e)=>submitHandler(e)}>
            <input type='text' placeholder='Enter Name' name="firstName" className='formField'></input>
            <input type='text' placeholder='Enter LastName'name="secondName" className='formField' ></input>
            <input type='text' placeholder='Enter Gender' name="gender" className='formField'></input>
            <input type='number' placeholder='Enter Age' name="age" className='formField'></input>
            <button type='submit'>Add</button>
          </form>
        </div>
        <div>
          <button onClick={sortListByAge}>Sort by Age</button>
        </div>

        <div>
          <button onClick={sortByName}> Sort By Name</button>
        </div>

        <div>
          <button onClick={toggleStudents}>Toggle Students</button>
        </div>
        <div>
          <button onClick={removeItem}>Delete</button>
        </div>
        
      </header>
    </div>
  );
}

export default Sandbox;
