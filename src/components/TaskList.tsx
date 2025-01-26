import { FC } from 'react';

interface Task {
  id: string;
  agentId: string;
  title: string;
  status: 'pending' | 'completed' | 'failed';
  result?: string;
}

interface Agent {
  id: string;
  name: string;
}

interface TaskListProps {
  tasks: Task[];
  agents: Agent[];
}

const TaskList: FC<TaskListProps> = ({ tasks, agents }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getAgentName = (agentId: string) => {
    return agents.find(agent => agent.id === agentId)?.name || 'Unknown Agent';
  };

  if (tasks.length === 0) {
    return (
      <div className="text-text-secondary text-center py-8">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="glass-panel bg-opacity-20">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium mb-1">{task.title}</h4>
              <p className="text-sm text-text-secondary">
                Agent: {getAgentName(task.agentId)}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>
          {task.result && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-sm text-text-secondary">{task.result}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
