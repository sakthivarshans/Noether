'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';


export default function TodoPage() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle && newDeadline) {
      addTask(newTaskTitle, newDeadline);
      setNewTaskTitle('');
      setNewDeadline('');
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>To-Do List & Assignment Tracker</CardTitle>
          <CardDescription>Stay organized and never miss a deadline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
            <Button onClick={handleAddTask} className="sm:w-auto w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.title}
                  </label>
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </li>
            ))}
            {tasks.length === 0 && <p className="text-center text-muted-foreground py-4">No tasks yet. Add one to get started!</p>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
