
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Clock } from 'lucide-react';
import { parse, differenceInMinutes, format } from 'date-fns';

interface TimetableEntry {
  subject: string;
  startTime: string;
  endTime: string;
}

export default function TimetablePage() {
  const [numberOfSubjects, setNumberOfSubjects] = useState(4);
  const [subjectNames, setSubjectNames] = useState<string[]>(Array(4).fill(''));
  const [hours, setHours] = useState(5);
  const [timetable, setTimetable] = useState<TimetableEntry[] | null>(null);

  const handleNumberOfSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (num > 0) {
      setNumberOfSubjects(num);
      setSubjectNames(Array(num).fill(''));
    } else {
        setNumberOfSubjects(0);
        setSubjectNames([]);
    }
  };
  
  const handleSubjectNameChange = (index: number, name: string) => {
    const newSubjectNames = [...subjectNames];
    newSubjectNames[index] = name;
    setSubjectNames(newSubjectNames);
  };

  const generateTimetable = () => {
    if (numberOfSubjects <= 0 || hours <= 0) return;

    const totalMinutes = hours * 60;
    const breakMinutes = 5;
    const totalBreaks = numberOfSubjects > 1 ? numberOfSubjects - 1 : 0;
    const studyMinutes = totalMinutes - (totalBreaks * breakMinutes);
    const minutesPerSubject = studyMinutes / numberOfSubjects;

    if (minutesPerSubject <= 0) {
        setTimetable([]);
        return;
    }
    
    const roundedMinutesPerSubject = Math.max(5, Math.round(minutesPerSubject / 5) * 5);

    const newTimetable: TimetableEntry[] = [];
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM

    for (let i = 0; i < numberOfSubjects; i++) {
      const startTime = new Date(currentTime.getTime());
      
      let endTime = new Date(startTime.getTime() + roundedMinutesPerSubject * 60000);

      newTimetable.push({
        subject: subjectNames[i] || `Subject ${i + 1}`,
        startTime: format(startTime, 'h:mm a'),
        endTime: format(endTime, 'h:mm a'),
      });
      
      currentTime = new Date(endTime.getTime());

      if (i < numberOfSubjects - 1) {
        const breakStart = new Date(currentTime.getTime());
        const breakEnd = new Date(breakStart.getTime() + breakMinutes * 60000);
        newTimetable.push({
            subject: 'Break',
            startTime: format(breakStart, 'h:mm a'),
            endTime: format(breakEnd, 'h:mm a'),
        });
        currentTime = breakEnd;
      }
    }
    setTimetable(newTimetable);
  };

  const timeToPosition = (time: string) => {
    const baseDate = new Date();
    const parsedTime = parse(time, 'h:mm a', baseDate);
    const startOfDay = new Date(baseDate.setHours(8, 0, 0, 0)); // Calendar starts at 8 AM
    return differenceInMinutes(parsedTime, startOfDay);
  };

  const calculateHeight = (startTime: string, endTime: string) => {
      const baseDate = new Date();
      const parsedStart = parse(startTime, 'h:mm a', baseDate);
      const parsedEnd = parse(endTime, 'h:mm a', baseDate);
      return differenceInMinutes(parsedEnd, parsedStart);
  }

  const hoursInDay = Array.from({ length: 15 }, (_, i) => 8 + i); // 8 AM to 10 PM

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Timetable Generator</CardTitle>
            <CardDescription>Enter your subjects and study hours to create a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjects">Number of Subjects</Label>
              <Input
                id="subjects"
                type="number"
                value={numberOfSubjects}
                onChange={handleNumberOfSubjectsChange}
                min="1"
              />
            </div>
             {numberOfSubjects > 0 && (
              <div className="space-y-3 pt-2">
                 <Label>Subject Names</Label>
                 {Array.from({ length: numberOfSubjects }).map((_, index) => (
                    <Input
                        key={index}
                        type="text"
                        placeholder={`Subject ${index + 1} Name`}
                        value={subjectNames[index]}
                        onChange={(e) => handleSubjectNameChange(index, e.target.value)}
                    />
                 ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="hours">Total Study Hours</Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="1"
              />
            </div>
            <Button onClick={generateTimetable} className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Generate Timetable
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Study Timetable</CardTitle>
            <CardDescription>Here is your generated schedule, shown for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {timetable ? (
              timetable.length > 0 ? (
                <div className="relative flex h-[840px]"> {/* 14 hours * 60px/hour = 840px */}
                    <div className="w-16 flex-shrink-0 text-right pr-2">
                        {hoursInDay.map(hour => (
                            <div key={hour} className="h-[60px] text-xs text-muted-foreground relative -top-2">
                                {format(new Date().setHours(hour, 0), 'h:mm a')}
                            </div>
                        ))}
                    </div>
                    <div className="relative flex-1 border-l">
                         {hoursInDay.slice(1).map(hour => (
                            <div key={`line-${hour}`} className="absolute w-full h-px bg-border" style={{ top: `${(hour-8)*60}px` }} />
                         ))}

                        {timetable.map((entry, index) => {
                            const top = timeToPosition(entry.startTime);
                            const height = calculateHeight(entry.startTime, entry.endTime);
                            const isBreak = entry.subject === 'Break';
                            return (
                                <div key={index} className={`absolute left-2 right-2 p-2 rounded-lg ${isBreak ? 'bg-secondary' : 'bg-primary/20 border border-primary/50'}`} style={{ top: `${top}px`, height: `${height}px`}}>
                                    <p className={`font-bold text-sm ${isBreak ? 'text-muted-foreground' : 'text-primary'}`}>{entry.subject}</p>
                                    <p className="text-xs text-muted-foreground">{entry.startTime} - {entry.endTime}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
              ) : (
                <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                  <p>Not enough time to schedule all subjects with breaks. Please increase the total study hours.</p>
                </div>
              )
            ) : (
              <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-[840px]">
                <Clock className="w-12 h-12 mb-4 text-primary/30"/>
                <p>Your timetable will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
