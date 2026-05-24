import React from 'react'

interface Submission {
  id: string
  task_id: string
  image_url: string
  status: string
}

const Submission = ({submission, relatedTask, feedbacks, setFeedbacks, acceptTask, addFeedback}: {submission: Submission, relatedTask: any, feedbacks: any, setFeedbacks: React.Dispatch<React.SetStateAction<any>>, acceptTask: (taskId: string) => void, addFeedback: (taskId: string) => void}) => {
  return (
    <div className="bg-white flex flex-col">
                <img
                  src={submission.image_url}
                  className="w-full h-56 object-cover border-b border-[#d6d2cb]"
                />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-neutral-400">Status</span>
                    <span className="font-mono text-[11px] tracking-widest">{submission.status}</span>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5">Feedback / Revision notes</label>
                    <textarea
                      placeholder="Write feedback for the user..."
                      value={relatedTask ? feedbacks[relatedTask.id] ?? "" : ""}
                      onChange={(e) => {
                        if (!relatedTask) return
                        setFeedbacks({ ...feedbacks, [relatedTask.id]: e.target.value })
                      }}
                      className="w-full bg-[#f5f3ef] border border-[#d6d2cb] text-sm text-neutral-900 px-3 py-2.5 outline-none focus:border-neutral-900 transition-colors resize-y"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => relatedTask && acceptTask(relatedTask.id)}
                      className="bg-[#2a5c3f] text-white font-mono text-[11px] tracking-widest uppercase px-4 py-2 hover:opacity-80 transition-opacity"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => relatedTask && addFeedback(relatedTask.id)}
                      className="bg-[#8a6a00] text-white font-mono text-[11px] tracking-widest uppercase px-4 py-2 hover:opacity-80 transition-opacity"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default Submission
