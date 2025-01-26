import Layout from '@/components/Layout';
import { DSCI_TOKEN_ADDRESS, DSCI_TOKEN_ABI } from '@/config/contracts';
import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { toast } from 'react-hot-toast';
import TaskList from '@/components/TaskList';
import { switchToAvalancheFuji } from '@/utils/network';
import dynamic from 'next/dynamic';

enum AgentType {
  RESEARCH,
  VALIDATION,
  COORDINATION
}

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  cost: number;
  rating: number;
  tasksCompleted: number;
}

interface Task {
  id: string;
  agentId: string;
  title: string;
  status: 'pending' | 'completed' | 'failed';
  result?: string;
}

const AVAILABLE_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'ResearchGPT',
    type: AgentType.RESEARCH,
    description: 'Specialized in scientific literature analysis, hypothesis generation, and experimental design',
    cost: 1,
    rating: 95,
    tasksCompleted: 150
  },
  {
    id: '2',
    name: 'ValidatorAI',
    type: AgentType.VALIDATION,
    description: 'Expert in methodology validation, statistical analysis, and reproducibility checks',
    cost: 2,
    rating: 98,
    tasksCompleted: 200
  },
  {
    id: '3',
    name: 'CoordinatorBot',
    type: AgentType.COORDINATION,
    description: 'Specializes in resource allocation, task routing, and multi-agent coordination',
    cost: 1.5,
    rating: 92,
    tasksCompleted: 180
  }
];

const AgentsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const { address } = useAccount();

  // Contract reads
  const { data: tokenBalance } = useContractRead({
    address: DSCI_TOKEN_ADDRESS as `0x${string}`,
    abi: DSCI_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleCreateTask = async () => {
    if (!selectedAgent || !taskInput) {
      toast.error('Please select an agent and enter a task description');
      return;
    }

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      agentId: selectedAgent.id,
      title: taskInput,
      status: 'pending'
    };

    setUserTasks([...userTasks, task]);
    setTaskInput('');
    toast.success('Task created successfully');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formattedBalance = tokenBalance ? formatEther(tokenBalance as bigint) : '0';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Nebula AI Agents</h1>
            <p className="text-text-secondary mt-2">Specialized AI agents to accelerate your research</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="glass-panel bg-opacity-30 px-4 py-2">
              <span className="text-sm text-text-secondary mr-2">NBL Balance:</span>
              <span className="font-mono font-bold">
                {formattedBalance} <span className="text-primary-purple">NBL</span>
              </span>
            </div>
            <button className="gradient-button">Register New Agent</button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7">
            <h2 className="text-xl font-semibold mb-4">Available Agents</h2>
            <div className="space-y-4">
              {AVAILABLE_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className={`glass-panel cursor-pointer transition-all ${
                    selectedAgent?.id === agent.id ? 'ring-2 ring-primary-purple' : ''
                  }`}
                  onClick={() => handleAgentSelect(agent)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                        <span className="glass-panel bg-opacity-30 px-2 py-1 text-xs">
                          {agent.cost} <span className="text-primary-purple">NBL</span>
                        </span>
                        <span className="glass-panel bg-opacity-30 px-2 py-1 text-xs text-green-400">
                          {agent.rating}% Rating
                        </span>
                      </div>
                      <p className="text-text-secondary mt-2">{agent.description}</p>
                      <p className="text-sm text-text-secondary mt-2">
                        {agent.tasksCompleted} tasks completed
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-5">
            <div className="glass-panel">
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
              {selectedAgent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      New Task for {selectedAgent.name}
                    </label>
                    <textarea
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Describe your task..."
                      className="input-field min-h-[100px]"
                    />
                  </div>
                  <button
                    onClick={handleCreateTask}
                    disabled={!taskInput}
                    className="gradient-button w-full"
                  >
                    Create New Task
                  </button>
                </div>
              ) : (
                <p className="text-text-secondary">Select an agent to create a task</p>
              )}

              <div className="mt-6">
                <TaskList tasks={userTasks} agents={AVAILABLE_AGENTS} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AgentsPage), {
  ssr: false
});
