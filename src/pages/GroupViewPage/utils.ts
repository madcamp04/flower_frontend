export interface Worker {
  user_name: string;
  user_email: string;
}

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
  tag_colors: string[];
}
