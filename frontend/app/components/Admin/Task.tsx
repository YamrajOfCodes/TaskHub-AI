import React from 'react'

interface Task {
  id: string
  title: string
  description: string
  product_image_url: string
  status: string
  assigned_to: string
  feedback?: string
}

interface User {
  id: string
  name: string
  email: string
}

interface TaskProps {
  task: Task
  users: User[]
  assignTask: (taskId: string, userId: string) => void
}

const Task = ({task,users,assignTask}:TaskProps) => {
  return (
    <>
      <div key={task.id} className="bg-white flex flex-col">
              <img
                src={
                  task.product_image_url?.startsWith("http")
                    ? task.product_image_url
                    : `http://127.0.0.1:5000/${task.product_image_url}`
                }
                alt={task.title}
                className="w-full h-48 object-cover border-b border-[#d6d2cb]"
              />
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-[15px] font-semibold leading-snug">{task.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed flex-1">{task.description}</p>

                {task.feedback && (
                  <div className="bg-[#fdf9ee] border border-[#e8d98a] p-3">
                    <p className="font-mono text-[10px] tracking-widest uppercase text-[#8a6a00] mb-1">Feedback</p>
                    <p className="text-[13px] text-neutral-800">{task.feedback}</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  {task.status.replace("_", " ")}
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5">Assign to</label>
                  <select
                    onChange={(e) => assignTask(task.id, e.target.value)}
                    className="w-full bg-[#f5f3ef] border border-[#d6d2cb] text-sm text-neutral-900 px-3 py-2.5 outline-none focus:border-neutral-900 transition-colors appearance-none"
                  >
                    <option>— Select user —</option>
                    {users
                      .filter((user:any) => user.role === "user")
                      .map((user:any) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
    </>
  )
}

export default Task
