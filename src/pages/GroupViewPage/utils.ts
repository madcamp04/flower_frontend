import { addDays, startOfWeek } from 'date-fns';
import { faker } from '@faker-js/faker';

export interface Task {
  task_title: string;
  start_date: Date;
  end_date: Date;
  worker_name: string;
  description: string;
  project_name: string;
  tag_color: string[];
}

export interface Project {
  project_name: string;
  project_description: string;
  tags: string[];
  tasks: Task[];
}

export const generateDummyData = (numProjects: number, numTasksPerProject: number): Project[] => {
  const projects: Project[] = [];
  const workers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const colors = ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFE0B2', '#D1C4E9'];

  for (let i = 0; i < numProjects; i++) {
    const projectTasks: Task[] = [];
    const project_name = faker.company.name();

    for (let j = 0; j < numTasksPerProject; j++) {
      let startDate = faker.date.between(startOfWeek(new Date()), addDays(new Date(), 7));
      startDate = new Date(startDate.setHours(0, 0, 0, 0));

      let endDate = addDays(startDate, faker.datatype.number({ min: 1, max: 7 }));
      endDate = new Date(endDate.setHours(0, 0, 0, 0));

      projectTasks.push({
        task_title: faker.lorem.words(),
        start_date: startDate,
        end_date: endDate,
        worker_name: workers[faker.datatype.number({ min: 0, max: workers.length - 1 })],
        description: faker.lorem.sentences(),
        project_name,
        tag_color: [colors[i % colors.length]], // Single color for task
      });
    }

    projects.push({
      project_name,
      project_description: faker.lorem.paragraph(),
      tags: [faker.lorem.word(), faker.lorem.word()],
      tasks: projectTasks,
    });
  }

  return projects;
};
