import { addDays, startOfWeek } from 'date-fns';
import { faker } from '@faker-js/faker';

export interface Task {
  id: number;
  worker: string;
  title: string;
  startDate: Date;
  endDate: Date;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  tasks: Task[];
  tags: string[];
  color: string;
}

export const generateDummyData = (numProjects: number, numTasksPerProject: number): Project[] => {
  const projects: Project[] = [];
  const workers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const colors = ['red', 'green', 'blue', 'orange', 'purple'];

  let taskIdCounter = 1;

  for (let i = 0; i < numProjects; i++) {
    const tasks: Task[] = [];
    const projectId = i + 1;

    for (let j = 0; j < numTasksPerProject; j++) {
      let startDate = faker.date.between(startOfWeek(new Date()), addDays(new Date(), 7));
      startDate = new Date(startDate.setHours(0, 0, 0, 0));

      let endDate = addDays(startDate, faker.datatype.number({ min: 1, max: 7 }));
      endDate = new Date(endDate.setHours(0, 0, 0, 0));

      tasks.push({
        id: taskIdCounter++,
        worker: workers[faker.datatype.number({ min: 0, max: workers.length - 1 })],
        title: faker.lorem.words(),
        startDate,
        endDate,
        projectId,
      });
    }

    projects.push({
      id: projectId,
      name: faker.company.name(),
      tasks,
      tags: [faker.lorem.word(), faker.lorem.word()],
      color: colors[i % colors.length],
    });
  }

  return projects;
};
