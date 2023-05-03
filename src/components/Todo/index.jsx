import React from "react";
import { API_PATH } from "../../App";

const filteredTodos = (todos, type = "all") => {
    if (type === "completed") {
        return todos.filter((item) => item.completed);
    } else if (type === "uncompleted") {
        return todos.filter((item) => !item.completed);
    } else {
        return todos;
    }
};

function Todo({ isLogin }) {
    const [todos, setTodos] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState({});
    const checkboxRef = React.useRef();
    const todoRef = React.useRef();

    const getTodos = () => {
        fetch(API_PATH + "todo", {
            headers: {
                Authorization: isLogin,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTodos(data);
            })
            .catch((err) => console.log(err));
    };

    React.useEffect(() => {
        getTodos();
    }, []);

    const saveTodo = (evt) => {
        evt.preventDefault();
        const todoValue = todoRef.current.value;

        if(!todoValue) return alert("Todo value is required");

        if (selectedItem.id) {
            fetch(API_PATH + "todo/" + selectedItem.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: isLogin,
                },
                body: JSON.stringify({
                    text: todoValue,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data === "updated") {
                        getTodos();
                        setSelectedItem({});
                    }
                })
                .catch((err) => console.log(err));
        } else {
            fetch(API_PATH + "todo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: isLogin,
                },
                body: JSON.stringify({
                    text: todoValue,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data);
                    if (data) getTodos();
                })
                .catch((err) => console.log(err));
        }

        todoRef.current.value = "";
        todoRef.current.focus();
    };

    const handleCheckbox = (id) => {
        fetch(API_PATH + "todo/edit/" + id, {
            method: "PUT",
            headers: {
                Authorization: isLogin,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data === "updated") getTodos();
            });
    };

    const handleDelete = (id) => {
        fetch(API_PATH + "todo/" + id, {
            method: "DELETE",
            headers: {
                Authorization: isLogin,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data === "deleted") getTodos();
            });
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        todoRef.current.value = item.todo_value;
    };


    // console.log(filteredTodos());


    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col-8 offset-2 my-5'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <form onSubmit={(evt) => saveTodo(evt)}>
                                    <div className='input-group'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            name='todo'
                                            ref={todoRef}
                                            defaultValue={
                                                selectedItem?.todo_value
                                            }
                                            placeholder='Add todo'
                                        />
                                        <button
                                            className='btn btn-primary'
                                            type='submit'
                                        >
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className='card-footer d-flex justify-content-center'>
                                <button
                                    className='btn btn-primary'
                                    type='button'
                                    onClick={() => filteredTodos(todos, "all")}
                                >
                                    All
                                </button>
                                <button
                                    className='btn btn-primary mx-3'
                                    type='button'
                                    onClick={() => filteredTodos(todos, "completed")}
                                >
                                    Completed
                                </button>
                                <button
                                    className='btn btn-primary'
                                    type='button'
                                    onClick={() => filteredTodos(todos, "uncompleted")}
                                >
                                    Uncompleted
                                </button>
                            </div>
                        </div>
                        <h1 className='text-center'>Todo List</h1>
                        <ul className='list-group'>
                            {todos.length > 0 &&
                                filteredTodos()?.map((item, index) => (
                                    <li
                                        className='list-group-item d-flex justify-content-between align-items-center'
                                        key={item.id}
                                    >
                                        <div>
                                            {index + 1}. &nbsp;
                                            <input
                                                className='form-check-input'
                                                type='checkbox'
                                                name='todo_check'
                                                ref={checkboxRef}
                                                defaultChecked={item.completed}
                                                onChange={() =>
                                                    handleCheckbox(item.id)
                                                }
                                            />
                                            &nbsp;
                                            <strong
                                                className={
                                                    item.completed ? "line" : ""
                                                }
                                            >
                                                {item.todo_value}
                                            </strong>
                                        </div>
                                        <div>
                                            <button
                                                className='btn btn-success me-3'
                                                type='button'
                                                onClick={() => handleEdit(item)}
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className='btn btn-danger'
                                                type='button'
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Todo;
