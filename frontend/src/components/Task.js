import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from './BtnPrimary'
import DropdownMenu from "./DropdownMenu";
// import TaskModal from "./TaskModal";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown"
import axios from "../axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";
import ManageMembersModal from './ManageMembersModal';


function Task() {

    // const itemsFromBackend = [
    //     { _id: uuid(), content: "First task" },
    //     { _id: uuid(), content: "Second task" },
    //     { _id: uuid(), content: "Third task" },
    //     { _id: uuid(), content: "Forth task" }
    // ];

    // const columnsFromBackend = {
    //     [uuid()]: {
    //         name: "Requested",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "To do",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "In Progress",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "Done",
    //         items: []
    //     }
    // };

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let data = {}
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            }
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            }

        }

        updateTodo(data)
    };

    const [isAddTaskModalOpen, setAddTaskModal] = useState(false);

    // const [columns, setColumns] = useState(columnsFromBackend);
    const [columns, setColumns] = useState({});
    const [isRenderChange, setRenderChange] = useState(false);
    const [isTaskOpen, setTaskOpen] = useState(false);
    const [taskId, setTaskId] = useState(false);
    const [title, setTitle] = useState('');
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isManageMembersOpen, setManageMembersOpen] = useState(false);

    // Get current user ID from localStorage (from login response)
    const currentUserId = (() => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.id || user?._id;
      } catch {
        return null;
      }
    })();

    useEffect(() => {
        if (!isAddTaskModalOpen || isRenderChange) {
            axios.get(`/project/${projectId}`)
                .then((res) => {
                    setTitle(res.data[0].title)
                    setColumns({
                        [uuid()]: {
                            name: "Requested",
                            items: res.data[0].task.filter((task) => task.stage === "Requested").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "To do",
                            items: res.data[0].task.filter((task) => task.stage === "To do").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "In Progress",
                            items: res.data[0].task.filter((task) => task.stage === "In Progress").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "Done",
                            items: res.data[0].task.filter((task) => task.stage === "Done").sort((a, b) => {
                                return a.order - b.order;
                            })
                        }
                    })
                    setRenderChange(false)
                }).catch((error) => {
                    toast.error('Something went wrong')
                })
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);

    const updateTodo = (data) => {
        axios.put(`/project/${projectId}/todo`, data)
            .then((res) => {
            }).catch((error) => {
                toast.error('Something went wrong')
            })
    }

    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        axios.delete(`/project/${projectId}/task/${taskId}`)
            .then((res) => {
                toast.success('Task is deleted')
                setRenderChange(true)
            }).catch((error) => {
                if (error.response && error.response.status === 403) {
                    toast.error('You do not have permission to delete tasks as a Viewer.')
                } else {
                    toast.error('Something went wrong')
                }
            })
    }

    const handleTaskDetails = (id) => {
        setTaskId({ projectId, id });
        setTaskOpen(true);
    }

    return (
        <div className='px-4 sm:px-8 py-6 w-full min-h-[80vh] bg-white dark:bg-gray-900 transition-colors duration-200'>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h1 className='text-lg sm:text-xl text-gray-800 dark:text-gray-100 flex justify-start items-center space-x-2.5'>
                    <span>{title.slice(0, 25)}{title.length > 25 && '...'}</span>
                    <ProjectDropdown id={projectId} navigate={navigate} />
                </h1>
                <div className="flex gap-2">
                  <BtnPrimary onClick={() => setAddTaskModal(true)}>Add todo</BtnPrimary>
                  <button
                    onClick={() => setManageMembersOpen(true)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold text-sm"
                  >
                    Manage Members
                  </button>
                </div>
            </div>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 -mx-4 sm:mx-0">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div
                                className="min-w-[260px] w-72 h-[520px] sm:h-[580px] bg-gray-50 dark:bg-gray-800 rounded-lg p-2 flex-shrink-0 transition-colors duration-200"
                                key={columnId}
                            >
                                <div className="pb-2.5 w-full flex justify-between">
                                    <div className="inline-flex items-center space-x-2">
                                        <h2 className="text-[#1e293b] dark:text-gray-200 font-medium text-sm uppercase leading-3">{column.name}</h2>
                                        <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-700 ${column.items.length < 1 && 'invisible'}`}>{column.items?.length}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={15} className="text-[#9ba8bc] dark:text-gray-400" viewBox="0 0 448 512"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56z" /></svg>
                                </div>
                                <div>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 ${snapshot.isDraggingOver && 'border-indigo-600'}`}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item._id}
                                                                draggableId={item._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{ ...provided.draggableProps.style }}
                                                                            onClick={() => handleTaskDetails(item._id)}
                                                                            className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 relative ${snapshot.isDragging && 'shadow-md'}`}
                                                                        >
                                                                            <div className="pb-2">
                                                                                <div className="flex item-center justify-between">
                                                                                    <h3 className="text-[#1e293b] dark:text-gray-100 font-medium text-sm capitalize">{item.title.slice(0, 22)}{item.title.length > 22 && '...'}</h3>
                                                                                    <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} />
                                                                                </div>
                                                                                <p className="text-xs text-slate-500 dark:text-gray-300 leading-4 -tracking-tight">{item.description.slice(0, 60)}{item.description.length > 60 && '...'}</p>
                                                                                <span className="py-1 px-2.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 rounded-md text-xs font-medium mt-1 inline-block">Task-{item.index}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>

                                </div>
                            </div>
                        );
                    })}
                </div >
            </DragDropContext >
            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} />
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
            <ManageMembersModal
              projectId={projectId}
              isOpen={isManageMembersOpen}
              onClose={() => setManageMembersOpen(false)}
              currentUserId={currentUserId}
            />
        </div >
    );
}

export default Task;