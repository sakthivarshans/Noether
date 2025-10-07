'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Download } from 'lucide-react';

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
    const totalBreaks = numberOfSubjects - 1 > 0 ? numberOfSubjects - 1 : 0;
    const studyMinutes = totalMinutes - (totalBreaks * breakMinutes);
    const minutesPerSubject = Math.round(studyMinutes / numberOfSubjects);

    if (minutesPerSubject <= 0) {
        // Handle case where hours are not enough for subjects with breaks
        setTimetable([]);
        return;
    }

    const newTimetable: TimetableEntry[] = [];
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM

    for (let i = 0; i < numberOfSubjects; i++) {
      const startTime = new Date(currentTime.getTime());
      const endTime = new Date(startTime.getTime() + minutesPerSubject * 60000);

      newTimetable.push({
        subject: subjectNames[i] || `Subject ${i + 1}`,
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      
      if (i < numberOfSubjects - 1) {
         currentTime = new Date(endTime.getTime() + breakMinutes * 60000);
      }
    }
    setTimetable(newTimetable);
  };

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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Study Timetable</CardTitle>
              <CardDescription>Here is your generated schedule with 5-minute breaks.</CardDescription>
            </div>
            {timetable && (
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {timetable ? (
              timetable.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timetable.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{entry.subject}</TableCell>
                        <TableCell>{entry.startTime}</TableCell>
                        <TableCell>{entry.endTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                  <p>Not enough time to schedule all subjects with breaks. Please increase the total study hours.</p>
                </div>
              )
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>Your timetable will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
