import { BACKLOG_SPRINT_ID } from '../src/features/sprints/constants';
import { SprintModel, TaskModel } from '../src/lib/db';
import { connectToDatabase } from '../src/lib/db/connection';

interface SprintRange {
  id: string;
  start: Date;
  end: Date;
}

const loadSprintsByWorkspace = async () => {
  const sprints = await SprintModel.find().exec();

  const map = new Map<string, SprintRange[]>();

  for (const sprint of sprints) {
    const entry: SprintRange = {
      id: sprint._id.toString(),
      start: new Date(sprint.startDate),
      end: new Date(sprint.endDate),
    };

    if (!map.has(sprint.workspaceId)) {
      map.set(sprint.workspaceId, []);
    }

    map.get(sprint.workspaceId)!.push(entry);
  }

  map.forEach((list) => list.sort((a, b) => a.start.getTime() - b.start.getTime()));

  return map;
};

const findSprintForDueDate = (sprints: SprintRange[] | undefined, dueDate: Date) => {
  if (!sprints) return undefined;

  return sprints.find((sprint) => dueDate >= sprint.start && dueDate <= sprint.end)?.id;
};

const main = async () => {
  await connectToDatabase();

  const sprintsByWorkspace = await loadSprintsByWorkspace();
  const tasks = await TaskModel.find().exec();

  let updated = 0;

  for (const task of tasks) {
    const dueDate = new Date(task.dueDate);
    if (Number.isNaN(dueDate.getTime())) continue;

    const matchingSprintId = findSprintForDueDate(sprintsByWorkspace.get(task.workspaceId), dueDate);
    const normalized = matchingSprintId ?? BACKLOG_SPRINT_ID;

    if (task.sprintId !== normalized) {
      task.sprintId = normalized;
      await task.save();
      updated++;
    }
  }

  console.log(`Updated ${updated} tasks with sprint assignments.`);
};

main()
  .then(() => {
    console.log('Sprint assignment seeding complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed sprint assignments', error);
    process.exit(1);
  });
