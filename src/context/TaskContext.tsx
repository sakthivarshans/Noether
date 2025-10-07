'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { differenceInMinutes } from 'date-fns';

export interface Task {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, deadline: string) => void;
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Finish Math Assignment', deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(), completed: false },
    { id: 2, title: 'Prepare for Physics Quiz', deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), completed: false },
    { id: 3, title: 'Read Chapter 5 of History book', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), completed: true },
  ]);
  const { toast } = useToast();
  const [notifiedTasks, setNotifiedTasks] = useState<number[]>([]);


  useEffect(() => {
    const checkDeadlines = () => {
      tasks.forEach(task => {
        if (!task.completed && !notifiedTasks.includes(task.id)) {
          const now = new Date();
          const deadlineDate = new Date(task.deadline);
          const minutesUntilDeadline = differenceInMinutes(deadlineDate, now);
          
          if (minutesUntilDeadline > 0 && minutesUntilDeadline <= 45) {
            toast({
              title: 'Deadline Approaching!',
              description: `Your task "${task.title}" is due in less than 45 minutes.`,
            });
            setNotifiedTasks(prev => [...prev, task.id]);
          }
        }
      });
    };

    const intervalId = setInterval(checkDeadlines, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [tasks, toast, notifiedTasks]);


  const addTask = (title: string, deadline: string) => {
    if (!title || !deadline) return;
    const newTask: Task = {
      id: Date.now(),
      title,
      deadline,
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
