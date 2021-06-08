import React, { useState, useEffect } from "react";
import { TaskRow } from "./components/TaskRow";
import { TaskBanner } from "./components/TaskBanner";
import  TaskCreator  from "./components/TaskCreator";
import  TaskEditor  from "./components/TaskEditor";
import { VisibilityControl } from "./components/VisibilityControl";
 
function App() {

  const [taskItems, setTaskItems] = useState([
    {id: 1, name: 'Tasks One', description: '', completed: false},
    {id: 2, name: 'Tasks Two', description: '', completed: false},
    {id: 3, name: 'Tasks Three', description: '', completed: true},      
  ]);

  const [showCompleted, setshowCompleted] = useState(true);
  const [editing, setEditing] = useState(false)
  const initialFormState = { id: null, name: '', description: '' }
  const [ currentTask, setCurrentTask ] = useState(initialFormState)

  useEffect(() => {
    let data = localStorage.getItem("tasks");
    if (data != null) {
        setTaskItems(JSON.parse(data))
    } else {
          
          setTaskItems([           
          ]);
          setshowCompleted(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskItems));
  }, [taskItems]);

  const toggleTask = task =>
    setTaskItems(
      taskItems.map(t => (t.name === task.name ? { ...t, completed: !t.completed } : t))
    );


  const taskTableRows = doneValue =>
    taskItems
      .filter(task => task.completed === doneValue)
      .map(task => (
        <TaskRow editRow={editRow} key={task.id} task={task} toggleTask={toggleTask} removeTask={removeTask}/>
      ));


  const createNewTask = ({name, desc}) => {
    console.log(name+''+desc)
    if (!taskItems.find(t => t.name === name)) {
      setTaskItems([...taskItems, {id: Date.now(), name: name, description: desc, completed: false }]);
    }
  };


  const updateTask = (id, updatedTask) => {
    setEditing(false)

    setTaskItems(taskItems.map(t => (t.id === id ? updatedTask : t)))
  }

  const editRow = task => {
    setEditing(true)

    setCurrentTask({ id: task.id, name: task.name, description: task.description })
  }


  const removeTask = (taskName) => {
    //console.log(taskName);
     const newList = taskItems.filter((item) => item.id !== taskName);
      setTaskItems(newList);
  };


  return (
    <div className="App container-fluid">

     

      <div className="row">
        <div className="col-md-6" > 
          <TaskBanner taskItems={taskItems} />
         
           {taskTableRows(false)}
      

        <div className="bg-secondary text-white text-center p-2">
          <VisibilityControl
            description="Completed Tasks"
            isChecked={showCompleted}
            total={taskItems.filter(t => t.completed).length}
            callback={checked => setshowCompleted(checked)}
          />
        </div>
        {showCompleted && (
         
            <div>{taskTableRows(true)}</div>

        )}

        </div>

       <div className="col-md-6" >
          {editing ? (

            <TaskEditor task={currentTask} setEditing={setEditing} updateTask={updateTask} />

          ) : (
            <TaskCreator task={{}} createNewTask={createNewTask} />
          )}
       </div>

      </div>

   </div>
  );
}

export default App;
